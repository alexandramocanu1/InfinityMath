const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// Configurația Netopia API v2 cu chei reale
const DEFAULT_WEBHOOK_URL =
    "https://us-central1-infinity-math-53be3.cloudfunctions.net/netopiaWebhook";

let NETOPIA_CONFIG;
try {
  NETOPIA_CONFIG = {
    // Aceste vor fi setate prin Firebase Config din secretele tale
    SIGNATURE: functions.config()
        .netopia?.signature || "31DH-KZHF-ONEY-OCYK-ZKHS",
    API_KEY: functions.config().netopia?.api_key,
    IS_SANDBOX: functions.config().netopia?.is_sandbox !== "false",
    WEBHOOK_URL: functions.config().netopia?.webhook_url || DEFAULT_WEBHOOK_URL,

    // URL-uri API v2 Netopia
    SANDBOX_API_URL: "https://secure-sandbox.netopia-payments.com/payment/card",
    LIVE_API_URL: "https://secure.netopia-payments.com/payment/card",
  };
} catch (error) {
  console.error("Error loading Netopia config:", error);
  NETOPIA_CONFIG = {
    SIGNATURE: "31DH-KZHF-ONEY-OCYK-ZKHS",
    API_KEY: null,
    IS_SANDBOX: true,
    WEBHOOK_URL: DEFAULT_WEBHOOK_URL,
    SANDBOX_API_URL: "https://secure-sandbox.netopia-payments.com/payment/card",
    LIVE_API_URL: "https://secure.netopia-payments.com/payment/card",
  };
}

/**
 * Creează payload-ul pentru API v2 Netopia conform documentației
 * @param {Object} paymentData - Datele pentru plată
 * @return {Object} Payload-ul formatat pentru API
 */
function createNetopiaPayload(paymentData) {
  const {
    orderId,
    amount,
    currency,
    description,
    customerInfo,
    returnUrl,
    notifyUrl,
  } = paymentData;

  return {
    config: {
      emailTemplate: "",
      notifyUrl: notifyUrl,
      redirectUrl: returnUrl,
      language: "RO",
    },
    payment: {
      options: {
        installments: 1,
        bonus: 0,
      },
      instrument: {
        type: "card",
        account: null,
        expMonth: null,
        expYear: null,
        secretCode: null,
        token: null,
      },
      data: {
        // Browser fingerprinting pentru 3D Secure
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

        // Date client
        firstName: customerInfo.firstName || "Client",
        lastName: customerInfo.lastName || "InfinityMath",
        email: customerInfo.email,
        phone: customerInfo.phone || "",

        // Adrese billing/shipping (obligatorii pentru Netopia)
        billingAddress: "Bucuresti, Romania",
        shippingAddress: "Bucuresti, Romania",
      },
    },
  };
}

exports.createPayment = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "Utilizatorul trebuie să fie autentificat",
      );
    }

    console.log("Received payment request:", data);

    // Verifică dacă avem API Key
    if (!NETOPIA_CONFIG.API_KEY) {
      console.error("Netopia API Key not configured");
      throw new functions.https.HttpsError(
          "failed-precondition",
          "Netopia API Key not configured. Check Firebase Functions config.",
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

    // Pregătește datele pentru API v2
    const paymentData = {
      orderId: orderId,
      amount: parseFloat(amount),
      currency: currency || "RON",
      description: description || "Plată Infinity Math",
      returnUrl: `https://infinity-math-53be3.web.app/payment-success?orderId=${orderId}`,
      notifyUrl: NETOPIA_CONFIG.WEBHOOK_URL,
      customerInfo: {
        firstName: customerInfo.firstName || "Client",
        lastName: customerInfo.lastName || "Test",
        email: customerInfo.email,
        phone: customerInfo.phone || "",
      },
    };

    // Salvează tranzacția în Firebase
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

    // Creează payload-ul pentru Netopia
    const netopiaPayload = createNetopiaPayload(paymentData);
    console.log("Netopia payload:", JSON.stringify(netopiaPayload, null, 2));

    // Determină URL-ul API
    const apiUrl = NETOPIA_CONFIG.IS_SANDBOX ?
        NETOPIA_CONFIG.SANDBOX_API_URL :
        NETOPIA_CONFIG.LIVE_API_URL;

    // Apelează API-ul Netopia pentru a începe plata
    try {
      const response = await axios.post(apiUrl, netopiaPayload, {
        headers: {
          "Authorization": NETOPIA_CONFIG.API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      console.log("Netopia API Response Status:", response.status);
      console.log("Netopia API Response:", response.data);

      if (response.data && response.data.status === 1) {
        const responseData = response.data.data;

        // Verifică dacă avem customerAction (înseamnă că interfața este gata)
        if (responseData.customerAction && responseData.customerAction.url) {
          const paymentUrl = responseData.customerAction.url;
          console.log("Payment URL received:", paymentUrl);

          // Actualizează tranzacția cu token-ul de sesiune
          await admin.firestore()
              .collection("transactions").doc(orderId).update({
                netopiaSessionToken: responseData
                    .customerAction.authenticationToken,
                netopiaResponse: response.data,
                paymentUrl: paymentUrl,
              });

          return {
            success: true,
            paymentUrl: paymentUrl,
            orderId: orderId,
            environment: NETOPIA_CONFIG.IS_SANDBOX ? "sandbox" : "live",
            sessionToken: responseData.customerAction.authenticationToken,
          };
        } else if (responseData.error && responseData.error.code === "0") {
          // Plata a fost aprobată direct (fără 3D Secure)
          await admin.firestore().collection("transactions")
              .doc(orderId).update({
                status: "confirmed",
                netopiaResponse: response.data,
                confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
              });

          return {
            success: true,
            paymentUrl: paymentData.returnUrl,
            orderId: orderId,
            environment: NETOPIA_CONFIG.IS_SANDBOX ? "sandbox" : "live",
            directApproval: true,
          };
        } else {
          throw new Error(`Netopia error:
            ${responseData.error?.message || "Unknown error"}`);
        }
      } else {
        throw new Error(`Invalid Netopia response:
          ${response.data?.message || "Unknown error"}`);
      }
    } catch (apiError) {
      console.error("API Error:", apiError.response?.data || apiError.message);

      // Log detaliat pentru debugging
      if (apiError.response) {
        console.error("Response status:", apiError.response.status);
        console.error("Response headers:", apiError.response.headers);
        console.error("Response data:", apiError.response.data);
      }
      throw new functions.https.HttpsError(
          "internal",
          `Netopia API error:
          ${apiError.response?.data?.message || apiError.message}`,
      );
    }
  } catch (error) {
    console.error("Eroare la crearea plății:", error);
    throw new functions.https.HttpsError(
        "internal",
        `Eroare la procesarea plății: ${error.message}`,
    );
  }
});

/**
 * Webhook pentru procesarea notificărilor de la Netopia
 */
exports.netopiaWebhook = functions.https.onRequest(async (req, res) => {
  try {
    console.log("=== NETOPIA WEBHOOK ===");
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Query:", req.query);

    // Netopia trimite POST cu datele în body
    let notificationData = null;

    if (req.method === "POST") {
      notificationData = req.body;
    } else if (req.method === "GET") {
      // Uneori Netopia poate trimite GET cu parametri
      notificationData = req.query;
    }

    if (!notificationData) {
      console.error("No notification data received");
      return res.status(400).send("No data received");
    }

    // Extrage informațiile importante
    const orderId = notificationData.orderId || notificationData.order_id;
    const ntpID = notificationData.ntpID || notificationData.ntp_id;
    const status = notificationData.status;
    const errorCode = notificationData.error?.code ||notificationData.errorCode;
    const errorMessage = notificationData.error?.message ||
    notificationData.errorMessage;
    console.log("Parsed notification:", {
      orderId, ntpID, status, errorCode, errorMessage,
    });

    if (!orderId && !ntpID) {
      console.error("No order ID found in notification");
      return res.status(400).send("Order ID missing");
    }

    // Caută tranzacția (întâi după orderId, apoi după ntpID)
    let transactionDoc;
    const searchId = orderId || ntpID;

    transactionDoc = await admin.firestore()
        .collection("transactions")
        .doc(searchId)
        .get();

    if (!transactionDoc.exists() && orderId !== ntpID) {
      // Încearcă să caute după ntpID dacă prima căutare a eșuat
      transactionDoc = await admin.firestore()
          .collection("transactions")
          .doc(ntpID)
          .get();
    }

    if (!transactionDoc.exists()) {
      console.log("Transaction not found:", searchId);
      return res.status(404).send("Transaction not found");
    }

    const transaction = transactionDoc.data();
    const userId = transaction.userId;
    const metadata = transaction.metadata;

    // Procesează rezultatul plății
    if (status === 3 || status === "3" ||
        (errorCode === "0" || errorCode === 0) ||
        notificationData.action === "confirmed") {
      console.log("Payment confirmed for transaction:", searchId);

      // Actualizează tranzacția ca fiind confirmată
      await admin.firestore()
          .collection("transactions").doc(transactionDoc.id).update({
            status: "confirmed",
            ntpID: ntpID || searchId,
            confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
            netopiaNotification: notificationData,
          });

      // Actualizează enrollment-ul dacă există
      if (metadata?.enrollmentId) {
        await admin.firestore().collection("enrollments")
            .doc(metadata.enrollmentId).update({
              status: "confirmed",
              paymentStatus: "paid",
              paymentId: ntpID || searchId,
              paymentDate: admin.firestore.FieldValue.serverTimestamp(),
            });

        if (metadata.scheduleId) {
          await admin.firestore().collection("schedules")
              .doc(metadata.scheduleId).update({
                enrolledCount: admin.firestore.FieldValue.increment(1),
              });
        }
      }

      // Activează abonamentul utilizatorului
      if (userId) {
        const now = new Date();
        const expirationDate = new Date(now);
        expirationDate.setMonth(now.getMonth() + 1);

        await admin.firestore().collection("users").doc(userId).update({
          "abonament.activ": true,
          "abonament.tip": metadata?.serviceTip || "evaluare",
          "abonament.dataInceperii":
          admin.firestore.FieldValue.serverTimestamp(),
          "abonament.dataExpirare":
          admin.firestore.Timestamp.fromDate(expirationDate),
          "abonament.ziuaSaptamanii": metadata?.scheduleDay,
          "abonament.oraCurs": metadata?.scheduleTime,
          "abonament.paymentId": ntpID || searchId,
        });

        console.log(`Subscription activated for user ${userId}`);
      }
    } else {
      console.log("Payment failed for transaction:", searchId);

      // Marchează tranzacția ca eșuată
      await admin.firestore()
          .collection("transactions").doc(transactionDoc.id).update({
            status: "failed",
            errorCode: errorCode,
            errorMessage: errorMessage,
            failedAt: admin.firestore.FieldValue.serverTimestamp(),
            netopiaNotification: notificationData,
          });
    }

    // Răspunde cu confirmare către Netopia
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error processing Netopia webhook:", error);
    res.status(500).send("Webhook processing failed");
  }
});

/**
 * Funcție pentru verificarea status-ului unei plăți
 */
exports.checkPaymentStatus = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "Utilizatorul trebuie să fie autentificat",
      );
    }

    const {orderId} = data;

    const transactionDoc = await admin.firestore()
        .collection("transactions")
        .doc(orderId)
        .get();

    if (!transactionDoc.exists()) {
      throw new functions.https.HttpsError(
          "not-found",
          "Tranzacția nu a fost găsită",
      );
    }

    const transaction = transactionDoc.data();

    return {
      success: true,
      orderId: orderId,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      createdAt: transaction.createdAt,
      confirmedAt: transaction.confirmedAt || null,
      ntpID: transaction.ntpID || null,
      environment: NETOPIA_CONFIG.IS_SANDBOX ? "sandbox" : "live",
    };
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw new functions.https.HttpsError(
        "internal",
        `Status check error: ${error.message}`,
    );
  }
});

// Păstrează funcția de test pentru dezvoltare
exports.createTestPayment = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "Utilizatorul trebuie să fie autentificat",
      );
    }

    const {orderId, amount, customerInfo} = data;

    const testUrl =
  `https://infinity-math-53be3.web.app/test-payment?` +
  `orderId=${orderId}&` +
  `amount=${amount}&` +
  `email=${encodeURIComponent(customerInfo.email)}&` +
  `name=${encodeURIComponent(
      `${customerInfo.firstName} ${customerInfo.lastName}`,
  )}`;


    return {
      success: true,
      paymentUrl: testUrl,
      orderId: orderId,
      environment: "test",
    };
  } catch (error) {
    console.error("Error creating test payment:", error);
    throw new functions.https.HttpsError(
        "internal",
        `Test payment error: ${error.message}`,
    );
  }
});
