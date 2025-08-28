const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Configurația Netopia API v2
const DEFAULT_WEBHOOK_URL =
    "https://us-central1-infinity-math-53be3.cloudfunctions.net/netopiaWebhook";

let NETOPIA_CONFIG;
try {
  NETOPIA_CONFIG = {
    API_KEY: functions.config().netopia?.api_key || "your-api-key-here",
    SIGNATURE: functions.config().netopia?.signature ||
        "31DH-KZHF-ONEY-OCYK-ZKHS",
    IS_SANDBOX: functions.config().netopia?.is_sandbox !== "false",
    SANDBOX_URL: "https://secure.sandbox.netopia-payments.com",
    LIVE_URL: "https://secure.netopia-payments.com",
    WEBHOOK_URL: functions.config().netopia?.webhook_url ||
        DEFAULT_WEBHOOK_URL,
  };
} catch (error) {
  console.error("Error loading Netopia config:", error);
  NETOPIA_CONFIG = {
    API_KEY: "your-api-key-here",
    SIGNATURE: "31DH-KZHF-ONEY-OCYK-ZKHS",
    IS_SANDBOX: true,
    SANDBOX_URL: "https://secure.sandbox.netopia-payments.com",
    LIVE_URL: "https://secure.netopia-payments.com",
    WEBHOOK_URL: DEFAULT_WEBHOOK_URL,
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

    // Structura de date pentru API v2 Netopia
    const paymentRequest = {
      config: {
        emailTemplate: "",
        emailSubject: "Confirmare plată Infinity Math",
        cancelUrl: `https://infinity-math-53be3.web.app/payment-cancel`,
        redirectUrl: `https://infinity-math-53be3.web.app/payment-success?orderId=${orderId}`,
        language: "RO",
      },
      payment: {
        orderID: orderId,
        amount: parseFloat(amount),
        currency: currency || "RON",
        details: description || "Plată Infinity Math",
        billing: {
          email: customerInfo.email,
          phone: customerInfo.phone || "",
          firstName: customerInfo.firstName || "Client",
          lastName: customerInfo.lastName || "Infinity Math",
          city: "Bucuresti",
          country: 642, // Romania
          state: "Bucuresti",
          postalCode: "010101",
          details: "Adresa client",
        },
        shipping: {
          email: customerInfo.email,
          phone: customerInfo.phone || "",
          firstName: customerInfo.firstName || "Client",
          lastName: customerInfo.lastName || "Infinity Math",
          city: "Bucuresti",
          country: 642,
          state: "Bucuresti",
          postalCode: "010101",
          details: "Adresa livrare",
        },
        products: [
          {
            name: description || "Curs Infinity Math",
            code: metadata?.serviceTip || "infinity-math",
            category: "education",
            price: parseFloat(amount),
            vat: 0,
          },
        ],
        installments: {
          selected: 1,
          available: [1],
        },
        data: {
          property1: orderId,
          property2: context.auth.uid,
          property3: metadata?.serviceTip || "evaluare",
        },
      },
    };

    // Salvează tranzacția în Firebase
    await admin.firestore().collection("transactions").doc(orderId).set({
      orderId: orderId,
      userId: context.auth.uid,
      amount: amount,
      currency: currency,
      status: "pending",
      paymentRequest: paymentRequest,
      metadata: metadata,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Pentru sandbox, returnează URL-ul direct către interfața de test
    if (NETOPIA_CONFIG.IS_SANDBOX) {
      // Creează URL-ul de test pentru sandbox
      const testPaymentUrl =
        `${NETOPIA_CONFIG.SANDBOX_URL}/sandbox/pay?` +
        `signature=${NETOPIA_CONFIG.SIGNATURE}&` +
        `orderId=${orderId}&` +
        `amount=${amount}&` +
        `currency=${currency || "RON"}&` +
        `details=${encodeURIComponent(description || "Plată Infinity Math")}&` +
        `email=${encodeURIComponent(customerInfo.email)}&` +
        `firstName=${encodeURIComponent(customerInfo.firstName || "")}&` +
        `lastName=${encodeURIComponent(customerInfo.lastName || "")}&` +
        `phone=${encodeURIComponent(customerInfo.phone || "")}&` +
        `returnUrl=${encodeURIComponent(paymentRequest.config.redirectUrl)}&` +
        `cancelUrl=${encodeURIComponent(paymentRequest.config.cancelUrl)}`;

      console.log("Using sandbox payment URL:", testPaymentUrl);

      return {
        success: true,
        paymentUrl: testPaymentUrl,
        orderId: orderId,
        environment: "sandbox",
      };
    }

    // Pentru live, va trebui să faci un call real la API
    // Momentan returnează o eroare pentru a forța folosirea sandbox-ului
    throw new functions.https.HttpsError(
        "unimplemented",
        "Pentru mediul live, contactați Netopia pt credențiale API complete",
    );
  } catch (error) {
    console.error("Eroare la crearea plății:", error);
    throw new functions.https.HttpsError(
        "internal",
        `Eroare la procesarea plății: ${error.message}`,
    );
  }
});

// Pentru testare - creează un payment URL simplu
exports.createTestPayment = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "Utilizatorul trebuie să fie autentificat",
      );
    }

    const {orderId, amount, customerInfo} = data;

    // URL de test care simulează interfața Netopia
    const testUrl =
      `https://infinity-math-53be3.web.app/test-payment?` +
      `orderId=${orderId}&` +
      `amount=${amount}&` +
      `email=${encodeURIComponent(customerInfo.email)}&` +
      `name=${encodeURIComponent(`${customerInfo.firstName}
        ${customerInfo.lastName}`)}`;

    return {
      success: true,
      paymentUrl: testUrl,
      orderId: orderId,
      environment: "test",
    };
  } catch (error) {
    console.error("Eroare la crearea plății de test:", error);
    throw new functions.https.HttpsError(
        "internal",
        `Eroare la procesarea plății de test: ${error.message}`,
    );
  }
});

// Webhook pentru confirmarea plăților
exports.netopiaWebhook = functions.https.onRequest(async (req, res) => {
  try {
    console.log("Received webhook from Netopia:", req.body);
    console.log("Headers:", req.headers);

    // Parsează datele webhook-ului
    let paymentData;
    let orderId;

    if (req.body.orderID) {
      // Format nou API v2
      paymentData = {
        ntpID: req.body.ntpID,
        orderId: req.body.orderID,
        status: req.body.status,
        errorCode: req.body.errorCode,
        errorMessage: req.body.errorMessage,
        amount: req.body.amount,
      };
      orderId = req.body.orderID;
    } else if (req.body.ntpID) {
      // Format vechi
      paymentData = req.body;
      orderId = paymentData.ntpID;
    } else {
      console.log("Unknown webhook format:", req.body);
      return res.status(400).send("Format necunoscut de webhook");
    }

    const {ntpID, status, errorCode, errorMessage} = paymentData;

    if (!orderId) {
      return res.status(400).send("ID-ul comenzii lipsește");
    }

    const transactionDoc = await admin.firestore()
        .collection("transactions")
        .doc(orderId)
        .get();

    if (!transactionDoc.exists()) {
      console.log("Tranzacția nu a fost găsită:", orderId);
      return res.status(404).send("Tranzacția nu a fost găsită");
    }

    const transaction = transactionDoc.data();
    const userId = transaction.userId;
    const metadata = transaction.metadata;

    // Status 3 = plată confirmată în Netopia
    if ((status === 3 || status === "confirmed") && !errorCode) {
      await admin.firestore().collection("transactions").doc(orderId).update({
        status: "confirmed",
        ntpID: ntpID,
        confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
        webhookResponse: req.body,
      });

      // Actualizează enrollment-ul dacă există
      if (metadata?.enrollmentId) {
        await admin.firestore().collection("enrollments")
            .doc(metadata.enrollmentId).update({
              status: "confirmed",
              paymentStatus: "paid",
              paymentId: ntpID || orderId,
              paymentDate: admin.firestore.FieldValue.serverTimestamp(),
            });

        if (metadata.scheduleId) {
          await admin.firestore().collection("schedules")
              .doc(metadata.scheduleId).update({
                enrolledCount: admin.firestore.FieldValue.increment(1),
              });
        }
      }

      // Activează abonamentul
      const now = new Date();
      const expirationDate = new Date(now);
      expirationDate.setMonth(now.getMonth() + 1);

      if (now.getDate() > expirationDate.getDate()) {
        expirationDate.setDate(0);
      }

      await admin.firestore().collection("users").doc(userId).update({
        "abonament.activ": true,
        "abonament.tip": metadata?.serviceTip || "evaluare",
        "abonament.dataInceperii": admin.firestore.FieldValue
            .serverTimestamp(),
        "abonament.dataExpirare": admin.firestore.Timestamp
            .fromDate(expirationDate),
        "abonament.ziuaSaptamanii": metadata?.scheduleDay,
        "abonament.oraCurs": metadata?.scheduleTime,
        "abonament.paymentId": ntpID || orderId,
      });

      console.log(`Plată confirmată prin webhook pentru ${userId}`);
    } else {
      await admin.firestore().collection("transactions").doc(orderId).update({
        status: "failed",
        errorCode: errorCode,
        errorMessage: errorMessage,
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
        webhookResponse: req.body,
      });

      console.log(`Plată eșuată prin webhook pentru tranzacția ${orderId}`);
    }

    res.status(200).send("Webhook procesat cu succes");
  } catch (error) {
    console.error("Eroare în webhook Netopia:", error);
    res.status(500).send("Eroare la procesarea webhook-ului");
  }
});

// Funcție pentru verificarea status-ului unei plăți
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
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      createdAt: transaction.createdAt,
      confirmedAt: transaction.confirmedAt || null,
      ntpID: transaction.ntpID || null,
    };
  } catch (error) {
    console.error("Eroare la verificarea status-ului:", error);
    throw new functions.https.HttpsError(
        "internal",
        `Eroare la verificarea status-ului: ${error.message}`,
    );
  }
});
