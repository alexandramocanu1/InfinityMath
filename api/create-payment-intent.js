const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { amount, currency, customerData, scheduleData, serviceName } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'ron',
      metadata: {
        customerName: customerData.name,
        customerEmail: customerData.email,
        serviceName: serviceName,
        scheduleDay: scheduleData.zi,
        scheduleTime: scheduleData.ora,
      },
      description: `Abonament ${serviceName} - ${scheduleData.zi} ${scheduleData.ora}`,
      receipt_email: customerData.email
    });

    res.status(200).json({
      client_secret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ 
      error: 'Eroare la crearea plății',
      details: error.message 
    });
  }
}