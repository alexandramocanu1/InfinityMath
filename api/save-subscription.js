export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { paymentIntentId, serviceType, schedule, customer, price } = req.body;

    console.log('Salvez abonament:', {
      paymentIntentId,
      serviceType,
      customer: customer.name,
      schedule: `${schedule.zi} ${schedule.ora}`,
      price: `${price} RON`
    });

    res.status(200).json({ 
      success: true, 
      subscriptionId: 'sub_' + Date.now()
    });

  } catch (error) {
    console.error('Eroare salvare:', error);
    res.status(500).json({ error: error.message });
  }
}