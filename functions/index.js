const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(
    functions.config().stripe.secret_key,
);

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Stripe webhook handler for processing payment events
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @return {Promise<void>} Promise that resolves when processing is complete
 */
exports.stripeWebhook = functions.https.onRequest(
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      let event;

      try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            functions.config().stripe.webhook_secret,
        );
      } catch (err) {
        console.error(
            "Webhook signature verification failed:",
            err.message,
        );
        return res
            .status(400)
            .send(`Webhook Error: ${err.message}`);
      }

      console.log(
          "Received Stripe event:",
          event.type,
          event.id,
      );

      try {
        if (event.type === "checkout.session.completed") {
          const session = event.data.object;
          console.log(
              "Processing successful payment:",
              session.id,
          );

          const successUrl = session.success_url;
          const urlParams = new URLSearchParams(
              successUrl.split("?")[1],
          );
          const serviceType = urlParams.get("service");

          console.log(
              "Service type from URL:",
              serviceType,
          );

          const enrollmentsRef = db.collection("enrollments");
          const pendingQuery = await enrollmentsRef
              .where("status", "==", "pending_payment")
              .orderBy("createdAt", "desc")
              .limit(10)
              .get();

          let enrollmentDoc = null;

          pendingQuery.forEach((doc) => {
            const data = doc.data();
            const timeDiff =
            Date.now() - data.createdAt.toDate().getTime();

            if (
              timeDiff < 30 * 60 * 1000 &&
            data.serviceTip === serviceType
            ) {
              enrollmentDoc = {id: doc.id, ...data};
            }
          });

          if (!enrollmentDoc) {
            console.error(
                "Nu s-a găsit enrollment-ul pentru session:",
                session.id,
            );
            return res
                .status(404)
                .send("Enrollment not found");
          }

          console.log(
              "Found enrollment:",
              enrollmentDoc.id,
              enrollmentDoc.userId,
          );

          await db
              .collection("enrollments")
              .doc(enrollmentDoc.id)
              .update({
                status: "paid",
                paymentSessionId: session.id,
                paidAt: admin.firestore.FieldValue.serverTimestamp(),
                paymentAmount: session.amount_total,
                paymentCurrency: session.currency,
              });

          const userRef = db
              .collection("users")
              .doc(enrollmentDoc.userId);

          const updateData = {
            "abonament.activ": true,
            "abonament.tip": enrollmentDoc.serviceTip,
            "abonament.dataInceperii":
              admin.firestore.FieldValue.serverTimestamp(),
            "abonament.ziuaSaptamanii":
              enrollmentDoc.scheduleDay,
            "abonament.oraCurs":
              enrollmentDoc.scheduleTime,
            "abonament.linkCurs": null,
            "abonament.sessionId": session.id,
            "abonament.scheduleId": enrollmentDoc.scheduleId,
            "abonament.serviceName": enrollmentDoc.serviceName,
            "abonament.status": "active",
            "abonament.paymentAmount":
              session.amount_total / 100,
            "abonament.dataUrmatoareiSedinte": null,
          };

          await userRef.update(updateData);

          if (enrollmentDoc.scheduleId) {
            const scheduleRef = db
                .collection("schedules")
                .doc(enrollmentDoc.scheduleId);
            await scheduleRef.update({
              enrolledCount:
                admin.firestore.FieldValue.increment(1),
            });
          }

          console.log(
              "Successfully processed payment for user:",
              enrollmentDoc.userId,
          );
          console.log(
              "Updated user subscription:",
              updateData,
          );

          res
              .status(200)
              .send("Payment processed successfully");
        } else if (event.type === "checkout.session.expired") {
          const session = event.data.object;
          console.log("Session expired:", session.id);

          const enrollmentsRef = db.collection("enrollments");
          const expiredQuery = await enrollmentsRef
              .where("status", "==", "pending_payment")
              .where(
                  "createdAt",
                  "<",
                  new Date(Date.now() - 24 * 60 * 60 * 1000),
              )
              .get();

          const batch = db.batch();
          expiredQuery.forEach((doc) => {
            batch.update(doc.ref, {status: "expired"});
          });

          if (!expiredQuery.empty) {
            await batch.commit();
            console.log(
                "Marked expired enrollments:",
                expiredQuery.size,
            );
          }

          res.status(200).send("Expired sessions handled");
        } else {
          console.log("Unhandled event type:", event.type);
          res
              .status(200)
              .send("Event received but not processed");
        }
      } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send("Internal server error");
      }
    },
);
