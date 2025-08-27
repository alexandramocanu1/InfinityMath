const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();

const NETOPIA_CONFIG = {
  SIGNATURE: "YOUR_NETOPIA_SIGNATURE",
  PUBLIC_CERT: functions.config().netopia.public_cert,
  SANDBOX_URL: "https://sandboxsecure.mobilpay.ro",
  LIVE_URL: "https://secure.mobilpay.ro",
  WEBHOOK_URL: "https://yourdomain.com/netopia-webhook",
  IS_SANDBOX: true,
};


// === HELPER: CRIPTARE PAYLOAD ===
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

    // Creează payload-ul Netopia
    const netopiaPayload = {
      order: {
        $: {id: orderId, timestamp: Date.now(), type: "card"},
        signature: NETOPIA_CONFIG.SIGNATURE,
        url: {
          return: `https://infinity-math-53be3.web.app/payment-success`,
          confirm: NETOPIA_CONFIG.WEBHOOK_URL,
        },
        invoice: {
          $: {currency: currency || "RON", amount: parseFloat(amount)},
          details: description || "Plată Infinity Math",
          contact_info: {
            billing: {
              $: {type: "person"},
              first_name: customerInfo.firstName,
              last_name: customerInfo.lastName,
              email: customerInfo.email,
              mobile_phone: customerInfo.phone,
            },
          },
        },
        ipn_cipher: "aes-256-cbc",
      },
    };

    const encryptedData = encryptPayload(netopiaPayload);

    await admin.firestore()
        .collection("transactions")
        .doc(orderId)
        .set({
          orderId,
          userId: context.auth.uid,
          amount,
          currency,
          status: "pending",
          netopiaOrder: netopiaPayload,
          metadata,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    const netopiaUrl = NETOPIA_CONFIG.IS_SANDBOX?
       NETOPIA_CONFIG.SANDBOX_URL:
       NETOPIA_CONFIG.LIVE_URL;

    return {
      success: true,
      encryptedData,
      netopiaUrl,
      orderId,
    };
  } catch (error) {
    console.error("Eroare la crearea plății:", error);
    throw new functions.https.HttpsError(
        "internal",
        `Eroare la procesarea plății: ${error.message}`,
    );
  }
});

// === HELPER: CREARE URL REDIRECT (opțional) ===
/**
 * Creează URL-ul de redirect către platforma Netopia
 * pe baza informațiilor comenzii și a mediului (sandbox/live).
 *
 * @param {Object} order - Obiect cu datele comenzii.
 * @param {boolean} isSandbox - Dacă tranzacția se rulează în Sandbox.
 * @return {string} URL-ul complet către Netopia.
 */
// function createRedirectUrl(order, isSandbox) {
//   const baseUrl = isSandbox?
//    NETOPIA_CONFIG.SANDBOX_URL:
//    NETOPIA_CONFIG.LIVE_URL;

//   const queryParams = new URLSearchParams({
//     account: NETOPIA_CONFIG.SIGNATURE,
//     amount: order.amount.toString(),
//     curr: order.currency,
//     invoice_id: order.orderId,
//     details: encodeURIComponent(order.description || ""),
//     lang: "ro",
//     fname: encodeURIComponent(order.firstName || ""),
//     lname: encodeURIComponent(order.lastName || ""),
//     email: encodeURIComponent(order.email || ""),
//     phone: encodeURIComponent(order.phone || ""),
//     confirm_url: encodeURIComponent(NETOPIA_CONFIG.WEBHOOK_URL),
//     return_url: encodeURIComponent(order.returnUrl),
//     cancel_return_url: encodeURIComponent(order.cancelUrl),
//   });

//   return `${baseUrl}?${queryParams.toString()}`;
// }
