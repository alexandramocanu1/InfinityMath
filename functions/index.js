const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const crypto = require("crypto");

const DEFAULT_WEBHOOK_URL =
    "https://us-central1-infinity-math-53be3.cloudfunctions.net/netopiaWebhook";

/**
 * Creează payload-ul pentru API v2 Netopia
 * @param {Object} paymentData - Datele pentru plată
 * @return {Object} Payload-ul formatat
 */
function createNetopiaPayload(paymentData) {
  const {
    orderId, amount, currency, description,
    customerInfo, returnUrl, notifyUrl,
  } = paymentData;

  return {
    config: {
      emailTemplate: "",
      notifyUrl: notifyUrl,
      redirectUrl: returnUrl,
      language: "RO",
    },
    payment: {
      options: {installments: 1, bonus: 0},
      instrument: {
        type: "card",
        account: null,
        expMonth: null,
        expYear: null,
        secretCode: null,
        token: null,
      },
      data: {
        BROWSER_USER_AGENT: "Mozilla/5.0 (compatible; InfinityMath/1.0)",
        OS: "Web",
        OS_VERSION: "1.0",
        MOBILE: "false",
        SCREEN_POINT: "false",
        SCREEN_PRINT: "Current Resolution: 1920x1080",
        orderId: orderId,
        amount: parseFloat(amount),
        currency: currency,
        details: description,
        firstName: customerInfo.firstName || "Client",
        lastName: customerInfo.lastName || "InfinityMath",
        email: customerInfo.email,
        phone: customerInfo.phone || "",
        billingAddress: "Bucuresti, Romania",
        shippingAddress: "Bucuresti, Romania",
      },
    },
  };
}

/**
 * Semnează payload-ul cu cheia privată
 * @param {Object} payload - Payload-ul de semnat
 * @param {string} privateKey - Cheia privată
 * @return {string} Semnătura în base64
 */
function signPayload(payload, privateKey) {
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(JSON.stringify(payload));
  signer.end();
  return signer.sign(privateKey, "base64");
}

/**
 * Obține configurația Netopia în siguranță
 * @return {Object} Configurația Netopia
 */
function getNetopiaConfig() {
  try {
    return {
      SIGNATURE: functions.config().netopia?.signature ||
          "31DH-KZHF-ONEY-OCYK-ZKHS",
      // Pentru Netopia, signature-ul ESTE API key-ul de multe ori
      API_KEY: functions.config().netopia?.signature ||
          functions.config().netopia?.api_key ||
          "31DH-KZHF-ONEY-OCYK-ZKHS",
      IS_SANDBOX: functions.config().netopia?.is_sandbox !== "false",
      WEBHOOK_URL: functions.config().netopia?.webhook_url ||
          DEFAULT_WEBHOOK_URL,
      SANDBOX_API_URL:
          "https://secure-sandbox.netopia-payments.com/payment/card",
      LIVE_API_URL: "https://secure.netopia-payments.com/payment/card",
    };
  } catch (error) {
    console.log("Using default config due to:", error.message);
    return {
      SIGNATURE: "31DH-KZHF-ONEY-OCYK-ZKHS",
      API_KEY: "31DH-KZHF-ONEY-OCYK-ZKHS",
      IS_SANDBOX: true,
      WEBHOOK_URL: DEFAULT_WEBHOOK_URL,
      SANDBOX_API_URL:
          "https://secure-sandbox.netopia-payments.com/payment/card",
      LIVE_API_URL: "https://secure.netopia-payments.com/payment/card",
    };
  }
}

exports.createPayment = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "Utilizatorul trebuie să fie autentificat",
      );
    }

    const {
      orderId,
      amount,
      currency,
      description,
      customerInfo,
      metadata,
    } = data;

    if (!orderId || !amount || !customerInfo) {
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Date incomplete pentru plată",
      );
    }

    const config = getNetopiaConfig();

    const paymentData = {
      orderId,
      amount: parseFloat(amount),
      currency: currency || "RON",
      description: description || "Plată Infinity Math",
      returnUrl: `https://infinity-math-53be3.web.app/payment-success?orderId=${orderId}`,
      notifyUrl: config.WEBHOOK_URL,
      customerInfo,
    };

    await admin.firestore().collection("transactions").doc(orderId).set({
      orderId: orderId,
      userId: context.auth.uid,
      amount: amount,
      currency: currency,
      status: "pending",
      paymentData: paymentData,
      metadata: metadata,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const netopiaPayload = createNetopiaPayload(paymentData);
    const apiUrl = config.IS_SANDBOX ?
        config.SANDBOX_API_URL :
        config.LIVE_API_URL;

    const privateKey = config.IS_SANDBOX ?
        functions.config().netopia?.private_key_sandbox :
        functions.config().netopia?.private_key;

    if (!privateKey) {
      const environment = config.IS_SANDBOX ? "sandbox" : "live";
      throw new functions.https.HttpsError(
          "failed-precondition",
          `Private key not configured for ${environment}`,
      );
    }

    const signature = signPayload(netopiaPayload, privateKey);

    console.log("Making API call to Netopia:", apiUrl);
    console.log("Using signature:", config.SIGNATURE);
    console.log("Payload:", JSON.stringify(netopiaPayload, null, 2));

    const response = await axios.post(apiUrl, netopiaPayload, {
      headers: {
        "Content-Type": "application/json",
        "Signature": signature,
        "X-EC-Signature": signature,
      },
      timeout: 30000,
    });

    console.log("Netopia Response:", response.data);

    return {
      success: true,
      paymentUrl: response.data?.data?.customerAction?.url ||
          paymentData.returnUrl,
      orderId,
      environment: config.IS_SANDBOX ? "sandbox" : "live",
      ntpID: response.data?.data?.ntpID,
    };
  } catch (error) {
    console.error("Eroare la createPayment:", error);

    if (error.response) {
      console.error("Netopia API Error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
    }

    const statusCode = error.response?.status || "unknown";
    throw new functions.https.HttpsError(
        "internal",
        `Payment failed: ${error.message}. Status: ${statusCode}`,
    );
  }
});
