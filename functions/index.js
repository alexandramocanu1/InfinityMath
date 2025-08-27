const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();

// Configurația Netopia
let NETOPIA_CONFIG;
try {
  NETOPIA_CONFIG = {
    SIGNATURE:
      functions.config().netopia?.signature ||
      "31DH-KZHF-ONEY-OCYK-ZKHS",
    PRIVATE_KEY: functions.config().netopia?.private_key || null,
    PUBLIC_CERT: functions.config().netopia?.public_cert || null,
    SANDBOX_URL: "https://sandboxsecure.mobilpay.ro",
    LIVE_URL: "https://secure.mobilpay.ro/public/card/new",
    IS_SANDBOX: functions.config().netopia?.is_sandbox === "true",
    WEBHOOK_URL:
      functions.config().netopia?.webhook_url ||
      "https://us-central1-infinity-math-53be3.cloudfunctions.net/netopiaWebhook",
  };
  console.log("Netopia config loaded:", {
    hasSignature: !!NETOPIA_CONFIG.SIGNATURE,
    hasPrivateKey: !!NETOPIA_CONFIG.PRIVATE_KEY,
    isSandbox: NETOPIA_CONFIG.IS_SANDBOX,
  });
} catch (err) {
  console.error("Error loading Netopia config:", err);
  NETOPIA_CONFIG = {
    SIGNATURE: "31DH-KZHF-ONEY-OCYK-ZKHS",
    PRIVATE_KEY: null,
    PUBLIC_CERT: null,
    SANDBOX_URL: "https://sandboxsecure.mobilpay.ro",
    LIVE_URL: "https://secure.mobilpay.ro/public/card/new",
    IS_SANDBOX: true,
    WEBHOOK_URL:
      "https://us-central1-infinity-math-53be3.cloudfunctions.net/netopiaWebhook",
  };
}

/**
 * Criptează payload-ul pentru Netopia folosind certificatul public.
 * @param {Object} payload - Obiectul de date al comenzii.
 * @return {string} Payload-ul criptat în Base64.
 */
function encryptPayload(payload) {
  const buffer = Buffer.from(JSON.stringify(payload));
  const cipher = crypto.publicEncrypt(NETOPIA_CONFIG.PUBLIC_CERT, buffer);
  return cipher.toString("base64");
}


// === FUNCȚIA DE PLATĂ ===
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

    const netopiaOrder = {
      signature: NETOPIA_CONFIG.SIGNATURE,
      orderId,
      amount: parseFloat(amount),
      currency: currency || "RON",
      description,
      returnUrl: `https://infinity-math-53be3.web.app/payment-success`,
      cancelUrl: `https://infinity-math-53be3.web.app/payment-cancel`,
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      email: customerInfo.email,
      phone: customerInfo.phone,
    };

    const paymentUrl = createRedirectUrl(
        netopiaOrder,
        NETOPIA_CONFIG.IS_SANDBOX,
    );

    await admin.firestore()
        .collection("transactions")
        .doc(orderId)
        .set({
          orderId,
          userId: context.auth.uid,
          amount,
          currency,
          status: "pending",
          netopiaOrder,
          metadata,
          paymentUrl,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    return {success: true, paymentUrl, orderId};
  } catch (error) {
    console.error("Eroare la crearea plății:", error);
    throw new functions.https.HttpsError(
        "internal",
        `Eroare la procesarea plății: ${error.message}`,
    );
  }
});

// === HELPER: CREARE URL REDIRECT ===

/**
 * Creează URL-ul de redirect către platforma Netopia
 * pe baza informațiilor comenzii și a mediului (sandbox/live).
 *
 * @param {Object} order - Obiect cu datele comenzii.
 * @param {string} order.orderId - ID-ul comenzii.
 * @param {number} order.amount - Suma tranzacției.
 * @param {string} order.currency - Moneda (ex. "RON").
 * @param {string} [order.description] - Descrierea tranzacției.
 * @param {string} [order.firstName] - Prenumele clientului.
 * @param {string} [order.lastName] - Numele clientului.
 * @param {string} [order.email] - Emailul clientului.
 * @param {string} [order.phone] - Telefonul clientului.
 * @param {string} order.returnUrl - URL de returnare după plată.
 * @param {string} order.cancelUrl - URL de returnare dacă plata e anulată.
 * @param {boolean} isSandbox - Dacă tranzacția se rulează în Sandbox.
 * @return {string} URL-ul complet către Netopia.
 */
function createRedirectUrl(order, isSandbox) {
  const baseUrl = isSandbox ?
  NETOPIA_CONFIG.SANDBOX_URL :
  NETOPIA_CONFIG.LIVE_URL;


  const queryParams = new URLSearchParams({
    account: NETOPIA_CONFIG.SIGNATURE,
    amount: order.amount.toString(),
    curr: order.currency,
    invoice_id: order.orderId,
    details: encodeURIComponent(order.description || ""),
    lang: "ro",
    fname: encodeURIComponent(order.firstName || ""),
    lname: encodeURIComponent(order.lastName || ""),
    email: encodeURIComponent(order.email || ""),
    phone: encodeURIComponent(order.phone || ""),
    confirm_url: encodeURIComponent(NETOPIA_CONFIG.WEBHOOK_URL),
    return_url: encodeURIComponent(order.returnUrl),
    cancel_return_url: encodeURIComponent(order.cancelUrl),
  });

  return `${baseUrl}?${queryParams.toString()}`;
}
