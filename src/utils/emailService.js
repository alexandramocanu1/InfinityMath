import emailjs from '@emailjs/browser';

// Configurare EmailJS
const SERVICE_ID = 'your_service_id'; // Din EmailJS dashboard
const TEMPLATE_ID_CLIENT = 'your_client_template_id'; // Template pentru client
const TEMPLATE_ID_ADMIN = 'your_admin_template_id'; // Template pentru tine
const USER_ID = 'your_user_id'; // Din EmailJS dashboard

export const sendBookingEmails = async (bookingData) => {
  try {
    // Email pentru client (confirmare)
    const clientEmailParams = {
      to_name: bookingData.client.name,
      to_email: bookingData.client.email,
      service_name: bookingData.service.name,
      service_price: bookingData.service.price,
      booking_date: new Date(bookingData.date).toLocaleDateString('ro-RO'),
      booking_time: bookingData.time,
      message: bookingData.client.message || 'Nu a fost specificat un mesaj'
    };

    // Email pentru tine (notificare)
    const adminEmailParams = {
      from_name: bookingData.client.name,
      from_email: bookingData.client.email,
      from_phone: bookingData.client.phone,
      service_name: bookingData.service.name,
      service_price: bookingData.service.price,
      booking_date: new Date(bookingData.date).toLocaleDateString('ro-RO'),
      booking_time: bookingData.time,
      client_message: bookingData.client.message || 'Nu a fost specificat un mesaj',
      admin_email: 'radu.ordean@email.ro' // Email-ul tău
    };

    // Trimite ambele email-uri
    const [clientResponse, adminResponse] = await Promise.all([
      emailjs.send(SERVICE_ID, TEMPLATE_ID_CLIENT, clientEmailParams, USER_ID),
      emailjs.send(SERVICE_ID, TEMPLATE_ID_ADMIN, adminEmailParams, USER_ID)
    ]);

    console.log('Email-uri trimise cu succes:', { clientResponse, adminResponse });
    return { success: true, clientResponse, adminResponse };

  } catch (error) {
    console.error('Eroare la trimiterea email-urilor:', error);
    return { success: false, error };
  }
};

// Template example pentru client
export const CLIENT_EMAIL_TEMPLATE = `
Bună {{to_name}},

Programarea ta a fost confirmată!

Detalii programare:
• Serviciu: {{service_name}}
• Preț: {{service_price}} RON
• Data: {{booking_date}}
• Ora: {{booking_time}}

{{#if message}}
Mesajul tău: {{message}}
{{/if}}

Te aștept cu drag!

Cu respect,
Radu Ordean
Doctorand în Matematică
`;

// Template example pentru admin
export const ADMIN_EMAIL_TEMPLATE = `
Programare nouă!

Client: {{from_name}}
Email: {{from_email}}
Telefon: {{from_phone}}

Serviciu: {{service_name}}
Preț: {{service_price}} RON
Data: {{booking_date}}
Ora: {{booking_time}}

{{#if client_message}}
Mesaj client: {{client_message}}
{{/if}}
`;