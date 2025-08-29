// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const axios = require("axios");
// const crypto = require("crypto");

// Inițializează Firebase Admin SDK
// admin.initializeApp();

// const DEFAULT_WEBHOOK_URL =
//     "https://us-central1-infinity-math-53be3.cloudfunctions.net/netopiaWebhook";

// /**
//  * Creează payload-ul pentru API-ul MobilPay/Netopia
//  * @param {Object} paymentData - Datele pentru plată
//  * @return {Object} Payload-ul formatat
//  */
// function createNetopiaPayload(paymentData) {
//   const {
//   } = paymentData;

//   const timestamp = Date.now();

//   return {
//     order: {
//       $: {
//         id: orderId,
//         timestamp: timestamp,
//         type: "card",
//       },
//       signature: functions.config()
//           .netopia?.signature || "31DH-KZHF-ONEY-OCYK-ZKHS",
//       url: {
//         return: returnUrl,
//         confirm: notifyUrl,
//       },
//       invoice: {
//         $: {
//           currency: currency,
//           amount: parseFloat(amount),
//         },
//         details: description || "Plată Infinity Math",
//         contact_info: {
//           billing: {
//             $: {
//               type: "person",
//             },
//             first_name: customerInfo.firstName || "Client",
//             last_name: customerInfo.lastName || "InfinityMath",
//             address: "Bucuresti, Romania",
//             email: customerInfo.email,
//             mobile_phone: customerInfo.phone || "",
//           },
//         },
//       },
//       ipn_cipher: "aes-256-cbc",
//     },
//   };
// }

// /**
//  * Criptează payload-ul folosind sistemul hibrid AES + RSA
//  * @param {Object} data - Datele de criptat
//  * @param {string} publicKey - Cheia publică RSA
//  * @return {Object} Obiect cu datele criptate și cheia criptată
//  */
// function encryptPayload(data, publicKey) {
//   const xmlData = convertToXML(data);

//   // AES 256-bit + IV 128-bit
//   const aesKey = crypto.randomBytes(32);
//   const iv = crypto.randomBytes(16);

//   // Criptează payload-ul cu AES
//   const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
//   let encryptedData = cipher.update(xmlData, "utf8", "base64");
//   encryptedData += cipher.final("base64");

//   // Criptează cheia AES cu RSA
//   const encryptedKey = crypto.publicEncrypt(
//       {
//         key: publicKey,
//         padding: crypto.constants.RSA_PKCS1_PADDING,
//       },
//       aesKey,
//   );

//   return {
//     data: encryptedData,
//     key: encryptedKey.toString("base64"),
//     iv: iv.toString("base64"),
//   };
// }


// /**
//  * Convertește obiectul în XML pentru Netopia
//  * @param {Object} obj - Obiectul de convertit
//  * @return {string} XML string
//  */
// function convertToXML(obj) {
//   /**
//    * Construiește recursiv XML-ul din obiect
//    * @param {Object} obj - Obiectul curent
//    * @param {string} rootName - Numele elementului root
//    * @return {string} XML string
//    */
//   function buildXML(obj, rootName = "") {
//     let xml = "";

//     if (rootName) {
//       const attributes = obj.$?
//      Object.keys(obj.$).map((key) => `${key}="${obj.$[key]}"`).join(" "): "";
//       xml += `<${rootName}${attributes ? " " + attributes : ""}>`;
//     }


//     // eslint-disable-next-line arrow-parens
//     Object.keys(obj).forEach(key => {
//       if (key === "$") return; // Skip attributes

//       const value = obj[key];
//       if (typeof value === "object" && value !== null) {
//         xml += buildXML(value, key);
//       } else {
//         xml += `<${key}>${value}</${key}>`;
//       }
//     });

//     if (rootName) {
//       xml += `</${rootName}>`;
//     }

//     return xml;
//   }

// }

// /**
//  * Obține configurația Netopia
//  * @return {Object} Configurația Netopia
//  */
// function getNetopiaConfig() {
//   try {
//     return {
//       SIGNATURE: functions.config().netopia?.signature ||
//           "31DH-KZHF-ONEY-OCYK-ZKHS",
//       IS_SANDBOX: functions.config().netopia?.is_sandbox !== "false",
//       WEBHOOK_URL: functions.config().netopia?.webhook_url ||
//           DEFAULT_WEBHOOK_URL,
//       SANDBOX_API_URL: "https://sandboxsecure.mobilpay.ro/",
//       LIVE_API_URL: "https://secure.mobilpay.ro/",
//     };
//   } catch (error) {
//     console.log("Using default config due to:", error.message);
//     return {
//       SIGNATURE: "31DH-KZHF-ONEY-OCYK-ZKHS",
//       IS_SANDBOX: true,
//       WEBHOOK_URL: DEFAULT_WEBHOOK_URL,
//       SANDBOX_API_URL: "https://sandboxsecure.mobilpay.ro/",
//       LIVE_API_URL: "https://secure.mobilpay.ro/",
//     };
//   }
// }

// exports.createPayment = functions.https.onCall(async (data, context) => {
//   try {
//     if (!context.auth) {
//       throw new functions.https.HttpsError(
//           "unauthenticated",
//           "Utilizatorul trebuie să fie autentificat",
//       );
//     }

//     const {
//       orderId, amount, currency, description, customerInfo, metadata,
//     } = data;

//     if (!orderId || !amount || !customerInfo) {
//       throw new functions.https.HttpsError(
//           "invalid-argument",
//           "Date incomplete pentru plată",
//       );
//     }

//     const config = getNetopiaConfig();

//     const paymentData = {
//       orderId,
//       amount: parseFloat(amount),
//       currency: currency || "RON",
//       description: description || "Plată Infinity Math",
//       returnUrl:
//         `https://infinity-math-53be3.web.app/payment-success?orderId=${orderId}`,
//       notifyUrl: config.WEBHOOK_URL,
//       customerInfo,
//     };

//     // Salvează tranzacția în baza de date
//     await admin.firestore().collection("transactions").doc(orderId).set({
//       orderId: orderId,
//       userId: context.auth.uid,
//       amount: amount,
//       currency: currency,
//       status: "pending",
//       paymentData: paymentData,
//       metadata: metadata,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     const netopiaPayload = createNetopiaPayload(paymentData);
//     const apiUrl = config.IS_SANDBOX ?
//         config.SANDBOX_API_URL :
//         config.LIVE_API_URL;

//     // Obține cheia publică pentru criptare
//     const publicKey = config.IS_SANDBOX ?
//         functions.config().netopia?.sandbox_public_cert :
//         functions.config().netopia?.public_cert;

//     if (!publicKey) {
//       const environment = config.IS_SANDBOX ? "sandbox" : "live";
//       throw new functions.https.HttpsError(
//           "failed-precondition",
//           `Public key not configured for ${environment}`,
//       );
//     }

//     console.log("Making API call to Netopia:", apiUrl);
//     console.log("Using signature:", config.SIGNATURE);
//     console.log("Payload:", JSON.stringify(netopiaPayload, null, 2));

//     // Criptează datele
//     const encryptedPayload = encryptPayload(netopiaPayload, publicKey);

//     // Creează formData pentru POST
//     const formData = new URLSearchParams();
//     formData.append("env_key", encryptedPayload.key);
//     formData.append("data", encryptedPayload.data);

//     const response = await axios.post(apiUrl, formData, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       timeout: 30000,
//       maxRedirects: 0, // Nu urmări redirect-urile automat
//       validateStatus: function(status) {
//         return status >= 200 && status < 400; // Acceptă și redirect-urile
//       },
//     });

//     console.log("Netopia Response Status:", response.status);
//     console.log("Netopia Response Headers:", response.headers);

//     // Pentru MobilPay/Netopia, răspunsul poate fi un redirect
//     if (response.status === 302 || response.status === 301) {
//       const redirectUrl = response.headers.location;
//       return {
//         success: true,
//         paymentUrl: redirectUrl,
//         orderId,
//         environment: config.IS_SANDBOX ? "sandbox" : "live",
//       };
//     }

//     // Dacă nu e redirect, verifică răspunsul
//     if (response.data) {
//       console.log("Netopia Response Data:", response.data);

//       // Caută un URL de plată în răspuns
//       const urlMatch = response.data.match(/https?:\/\/[^\s<>"]+/);
//       if (urlMatch) {
//         return {
//           success: true,
//           paymentUrl: urlMatch[0],
//           orderId,
//           environment: config.IS_SANDBOX ? "sandbox" : "live",
//         };
//       }
//     }

//     return {
//       success: true,
//       paymentUrl: paymentData.returnUrl, // Fallback
//       orderId,
//       environment: config.IS_SANDBOX ? "sandbox" : "live",
//     };
//   } catch (error) {
//     console.error("Eroare la createPayment:", error);

//     if (error.response) {
//       console.error("Netopia API Error:", {
//         status: error.response.status,
//         statusText: error.response.statusText,
//         data: error.response.data,
//         headers: error.response.headers,
//       });
//     }

//     const statusCode = error.response?.status || "unknown";
//     throw new functions.https.HttpsError(
//         "internal",
//         `Payment failed: ${error.message}. Status: ${statusCode}`,
//     );
//   }
// });

// exports.netopiaWebhook = functions.https.onRequest(async (req, res) => {
//   try {
//     console.log("=== NETOPIA WEBHOOK ===");
//     console.log("Method:", req.method);
//     console.log("Body:", req.body);

//     // Procesează notificarea de la Netopia
//     res.status(200).send("OK");
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     res.status(500).send("Webhook processing failed");
//   }
// });
