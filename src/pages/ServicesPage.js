const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Inițializează Firebase Admin
admin.initializeApp();

// Configurația Netopia din Firebase config
let NETOPIA_CONFIG;
try {
  NETOPIA_CONFIG = {
    SIGNATURE: functions.config().netopia?.signature ||
        "31DH-KZHF-ONEY-OCYK-ZKHS",
    PRIVATE_KEY: functions.config().netopia?.private_key,
    PUBLIC_CERT: functions.config().netopia?.public_cert,
    SANDBOX_URL: "https://sandbox.netopia-payments.com",
    LIVE_URL: "https://www.netopia-payments.com",
    IS_SANDBOX: functions.config().netopia?.is_sandbox === "true",
    WEBHOOK_URL: functions.config().netopia?.webhook_url ||
        "https://us-central1-infinity-math-53be3.cloudfunctions.net/netopiaWebhook",
  };
  console.log("Netopia config loaded:", {
    hasSignature: !!NETOPIA_CONFIG.SIGNATURE,
    hasPrivateKey: !!NETOPIA_CONFIG.PRIVATE_KEY,
    isSandbox: NETOPIA_CONFIG.IS_SANDBOX,
  });
} catch (error) {
  console.error("Error loading Netopia config:", error);
  // Fallback pentru testing local
  NETOPIA_CONFIG = {
    SIGNATURE: "31DH-KZHF-ONEY-OCYK-ZKHS",
    PRIVATE_KEY: null,
    PUBLIC_CERT: null,
    SANDBOX_URL: "https://sandbox.netopia-payments.com",
    LIVE_URL: "https://www.netopia-payments.com",
    IS_SANDBOX: true,
    WEBHOOK_URL: "https://us-central1-infinity-math-53be3.cloudfunctions.net/netopiaWebhook",
  };
}

// Funcție pentru crearea plății
exports.createPayment = functions.https.onCall(async (data, context) => {
  try {
    // Verifică autentificarea
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated",
          "Utilizatorul trebuie să fie autentificat");
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

    // Validează datele
    if (!orderId || !amount || !customerInfo) {
      throw new functions.https.HttpsError("invalid-argument",
          "Date incomplete pentru plată");
    }

    // Creează payload-ul pentru Netopia conform documentației
    const netopiaOrder = {
      signature: NETOPIA_CONFIG.SIGNATURE,
      orderId: orderId,
      amount: parseFloat(amount),
      currency: currency || "RON",
      description: description,
      returnUrl: `https://${process.env.GCLOUD_PROJECT ||
          "infinity-math-53be3"}.web.app/payment-success`,
      cancelUrl: `https://${process.env.GCLOUD_PROJECT ||
          "infinity-math-53be3"}.web.app/payment-cancel`,
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      email: customerInfo.email,
      phone: customerInfo.phone,
    };

    console.log("Netopia order created:", netopiaOrder);

    let paymentUrl;

    if (NETOPIA_CONFIG.IS_SANDBOX) {
      // Pentru sandbox - folosește API-ul de test
      paymentUrl = await createNetopiaPaymentUrl(netopiaOrder, true);
    } else {
      // Pentru producție - folosește API-ul live
      paymentUrl = await createNetopiaPaymentUrl(netopiaOrder, false);
    }

    // Salvează tranzacția în Firebase cu status pending
    await admin.firestore().collection("transactions").doc(orderId).set({
      orderId: orderId,
      userId: context.auth.uid,
      amount: amount,
      currency: currency,
      status: "pending",
      netopiaOrder: netopiaOrder,
      metadata: metadata,
      paymentUrl: paymentUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Transaction saved, payment URL:", paymentUrl);

    return {
      success: true,
      paymentUrl: paymentUrl,
      orderId: orderId,
    };
  } catch (error) {
    console.error("Eroare la crearea plății:", error);
    throw new functions.https.HttpsError("internal",
        `Eroare la procesarea plății: ${error.message}`);
  }
});

/**
 * Creează URL-ul de plată pentru Netopia
 * @param {Object} order - Obiectul cu detaliile comenzii
 * @param {boolean} isSandbox - True pentru sandbox, false pentru producție
 * @return {Promise<string>} URL-ul de plată
 */
async function createNetopiaPaymentUrl(order, isSandbox) {
  try {
    const baseUrl = isSandbox ?
        "https://sandbox.netopia-payments.com" :
        "https://www.netopia-payments.com";

    // Pentru Netopia, trebuie să faci un POST request pentru a obține URL-ul
    const fetch = require("node-fetch");

    const response = await fetch(`${baseUrl}/payment/card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NETOPIA_CONFIG.SIGNATURE}`,
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      console.log(`Netopia API error: ${response.status}, falling back to redirect URL`);
      // Fallback la redirect URL dacă API-ul nu funcționează
      return createRedirectUrl(order, isSandbox);
    }

    const result = await response.json();

    if (result.paymentURL) {
      return result.paymentURL;
    } else {
      // Fallback pentru testare dacă API-ul nu returnează URL-ul așteptat
      return createRedirectUrl(order, isSandbox);
    }
  } catch (error) {
    console.error("Eroare la crearea URL-ului Netopia:", error);
    // Fallback pentru cazul în care API-ul nu funcționează
    return createRedirectUrl(order, isSandbox);
  }
}

/**
 * Creează un URL de redirecționare pentru Netopia cu parametri în query string
 * @param {Object} order - Obiectul cu detaliile comenzii
 * @param {boolean} isSandbox - True pentru sandbox, false pentru producție
 * @return {string} URL-ul de redirecționare către Netopia
 */
function createRedirectUrl(order, isSandbox) {
  const baseUrl = isSandbox ?
      "https://sandbox.netopia-payments.com" :
      "https://www.netopia-payments.com";

  const queryParams = new URLSearchParams({
    signature: NETOPIA_CONFIG.SIGNATURE,
    orderId: order.orderId,  // ✅ Fixed: use order.orderId instead of order.order.orderID
    amount: order.amount.toString(),  // ✅ Fixed: use order.amount
    currency: order.currency,  // ✅ Fixed: use order.currency
    description: encodeURIComponent(order.description),  // ✅ Fixed: use order.description
    returnUrl: encodeURIComponent(order.returnUrl),  // ✅ Added return URL
    cancelUrl: encodeURIComponent(order.cancelUrl),  // ✅ Added cancel URL
    firstName: encodeURIComponent(order.firstName || ''),  // ✅ Added customer info
    lastName: encodeURIComponent(order.lastName || ''),
    email: encodeURIComponent(order.email || ''),
    phone: encodeURIComponent(order.phone || ''),
  });

  return `${baseUrl}/payment/card?${queryParams.toString()}`;
}

// Endpoint pentru confirmarea plăților (simulare pentru testare)
exports.confirmPayment = functions.https.onCall(async (data, context) => {
  try {
    const {orderId, status = "confirmed"} = data;

    if (!orderId) {
      throw new functions.https.HttpsError("invalid-argument",
          "Order ID lipsește");
    }

    // Găsește tranzacția
    const transactionDoc = await admin.firestore()
        .collection("transactions")
        .doc(orderId)
        .get();

    if (!transactionDoc.exists) {
      throw new functions.https.HttpsError("not-found",
          "Tranzacția nu a fost găsită");
    }

    const transaction = transactionDoc.data();
    const userId = transaction.userId;
    const metadata = transaction.metadata;

    if (status === "confirmed") {
      // Actualizează tranzacția
      await admin.firestore().collection("transactions").doc(orderId).update({
        status: "confirmed",
        confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Actualizează enrollment-ul
      if (metadata.enrollmentId) {
        await admin.firestore().collection("enrollments")
            .doc(metadata.enrollmentId).update({
              status: "confirmed",
              paymentStatus: "paid",
              paymentId: orderId,
              paymentDate: admin.firestore.FieldValue.serverTimestamp(),
            });

        // Incrementează numărul de înscriși
        await admin.firestore().collection("schedules")
            .doc(metadata.scheduleId).update({
              enrolledCount: admin.firestore.FieldValue.increment(1),
            });
      }

      // Activează abonamentul pentru o lună
      const now = new Date();
      const expirationDate = new Date(now);
      expirationDate.setMonth(now.getMonth() + 1);

      // Dacă suntem la sfârșitul lunii și luna viitoare are mai puține zile
      if (now.getDate() > expirationDate.getDate()) {
        expirationDate.setDate(0); // Setează la ultima zi a lunii
      }

      await admin.firestore().collection("users").doc(userId).update({
        "abonament.activ": true,
        "abonament.tip": metadata.serviceTip,
        "abonament.dataInceperii": admin.firestore.FieldValue
            .serverTimestamp(),
        "abonament.dataExpirare": admin.firestore.Timestamp
            .fromDate(expirationDate),
        "abonament.ziuaSaptamanii": metadata.scheduleDay,
        "abonament.oraCurs": metadata.scheduleTime,
        "abonament.paymentId": orderId,
      });

      console.log(`Plată confirmată pentru utilizatorul ${userId}, ` +
          `tranzacția ${orderId}`);

      return {
        success: true,
        message: "Plată confirmată cu succes",
      };
    } else {
      // Plata eșuată
      await admin.firestore().collection("transactions").doc(orderId).update({
        status: "failed",
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: false,
        message: "Plata a eșuat",
      };
    }
  } catch (error) {
    console.error("Eroare la confirmarea plății:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// Webhook pentru primirea confirmărilor de la Netopia (pentru production)
exports.netopiaWebhook = functions.https.onRequest(async (req, res) => {
  try {
    console.log("Received webhook from Netopia:", req.body);

    const {ntpID, status, errorCode, errorMessage} = req.body;

    if (!ntpID) {
      return res.status(400).send("ID-ul tranzacției lipsește");
    }

    // Găsește tranzacția în Firebase
    const transactionDoc = await admin.firestore()
        .collection("transactions")
        .doc(ntpID)
        .get();

    if (!transactionDoc.exists) {
      console.log("Tranzacția nu a fost găsită:", ntpID);
      return res.status(404).send("Tranzacția nu a fost găsită");
    }

    const transaction = transactionDoc.data();
    const userId = transaction.userId;
    const metadata = transaction.metadata;

    if (status === "confirmed" && !errorCode) {
      // Plata confirmată
      await admin.firestore().collection("transactions").doc(ntpID).update({
        status: "confirmed",
        confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
        webhookResponse: req.body,
      });

      // Actualizează enrollment-ul
      if (metadata?.enrollmentId) {
        await admin.firestore().collection("enrollments")
            .doc(metadata.enrollmentId).update({
              status: "confirmed",
              paymentStatus: "paid",
              paymentId: ntpID,
              paymentDate: admin.firestore.FieldValue.serverTimestamp(),
            });

        // Incrementează numărul de înscriși
        if (metadata.scheduleId) {
          await admin.firestore().collection("schedules")
              .doc(metadata.scheduleId).update({
                enrolledCount: admin.firestore.FieldValue.increment(1),
              });
        }
      }

      // Activează abonamentul pentru o lună
      const now = new Date();
      const expirationDate = new Date(now);
      expirationDate.setMonth(now.getMonth() + 1);

      if (now.getDate() > expirationDate.getDate()) {
        expirationDate.setDate(0); // Setează la ultima zi a lunii
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
        "abonament.paymentId": ntpID,
      });

      console.log(`Plată confirmată prin webhook pentru ${userId}, ` +
          `tranzacția ${ntpID}`);
    } else {
      // Plata eșuată
      await admin.firestore().collection("transactions").doc(ntpID).update({
        status: "failed",
        errorCode: errorCode,
        errorMessage: errorMessage,
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
        webhookResponse: req.body,
      });

      if (metadata?.enrollmentId) {
        await admin.firestore().collection("enrollments")
            .doc(metadata.enrollmentId).update({
              status: "payment_failed",
              paymentStatus: "failed",
              paymentError: errorMessage || "Plată eșuată",
            });
      }

      console.log(`Plată eșuată prin webhook pentru tranzacția ` +
          `${ntpID}: ${errorMessage}`);
    }

    res.status(200).send("Webhook procesat cu succes");
  } catch (error) {
    console.error("Eroare în webhook Netopia:", error);
    res.status(500).send("Eroare la procesarea webhook-ului");
  }
});

// Funcție pentru verificarea expirării abonamentelor (rulează zilnic)
exports.checkExpiredSubscriptions = functions.pubsub
    .schedule("0 9 * * *")
    .timeZone("Europe/Bucharest")
    .onRun(async (context) => {
      try {
        const now = admin.firestore.Timestamp.now();

        // Găsește abonamentele expirate
        const expiredSubscriptions = await admin.firestore()
            .collection("users")
            .where("abonament.activ", "==", true)
            .where("abonament.dataExpirare", "<=", now)
            .get();

        if (expiredSubscriptions.empty) {
          console.log("Nu sunt abonamente expirate de dezactivat");
          return null;
        }

        const batch = admin.firestore().batch();

        expiredSubscriptions.forEach((doc) => {
          batch.update(doc.ref, {
            "abonament.activ": false,
            "abonament.dataExpirare": null,
            "abonament.expiredAt": admin.firestore.FieldValue
                .serverTimestamp(),
          });
        });

        await batch.commit();
        console.log(`Dezactivate ${expiredSubscriptions.size} ` +
            `abonamente expirate`);

        return null;
      } catch (error) {
        console.error("Eroare la verificarea abonamentelor expirate:", error);
        return null;
      }
    });

// Funcție pentru testarea configurației
exports.testConfig = functions.https.onCall(async (data, context) => {
  return {
    hasSignature: !!NETOPIA_CONFIG.SIGNATURE,
    hasPrivateKey: !!NETOPIA_CONFIG.PRIVATE_KEY,
    hasCert: !!NETOPIA_CONFIG.PUBLIC_CERT,
    isSandbox: NETOPIA_CONFIG.IS_SANDBOX,
    signature: NETOPIA_CONFIG.SIGNATURE,
    projectId: process.env.GCLOUD_PROJECT,
  };
});

// Funcție pentru test de conectivitate
exports.helloWorld = functions.https.onRequest((request, response) => {
  console.log("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase Functions!");
});