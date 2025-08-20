import React, { useState } from 'react';
import { Mail, Phone, Send, MapPin, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { contactPageStyles } from './ContactPageStyles';

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    nume: '',
    prenume: '',
    email: '',
    optiune: '',
    mesaj: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Configurează EmailJS din variabilele de mediu
  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Debug: verifică dacă variabilele sunt încărcate
    console.log('🔍 Debug EmailJS:');
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('Public Key:', EMAILJS_PUBLIC_KEY);
    
    // Verifică dacă toate variabilele sunt setate
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.log('❌ Variabile lipsă!');
      setError('Configurația EmailJS nu este completă. Verifică variabilele de mediu.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Pregătește datele pentru email - DOAR variabilele din template
      const templateParams = {
        from_name: `${contactForm.nume} ${contactForm.prenume}`,
        from_email: contactForm.email,
        message: contactForm.mesaj,
        optiune: contactForm.optiune
        // Am eliminat to_email - nu există în template
      };

      console.log('📧 Template params:', templateParams);

      // Trimite email-ul folosind EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('✅ Email trimis cu succes:', result);
      
      // Resetează formularul și arată mesajul de succes
      setContactForm({
        nume: '',
        prenume: '',
        email: '',
        optiune: '',
        mesaj: ''
      });
      
      setShowSuccess(true);
      
      // Ascunde mesajul de succes după 5 secunde
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('❌ Eroare completă:', error);
      console.error('📝 Detalii eroare:', {
        status: error.status,
        text: error.text,
        message: error.message
      });
      
      // Mesaj de eroare mai detaliat
      let errorMessage = 'A apărut o eroare la trimiterea mesajului.';
      
      if (error.status === 400) {
        errorMessage = 'Datele formularului sunt incomplete sau invalide.';
      } else if (error.status === 401) {
        errorMessage = 'Cheia API nu este validă.';
      } else if (error.status === 404) {
        errorMessage = 'Serviciul sau template-ul nu a fost găsit.';
      } else if (error.text) {
        errorMessage = `Eroare: ${error.text}`;
      }
      
      setError(errorMessage);
    }
    
    setIsLoading(false);
  };

  return (
    <div style={contactPageStyles.container}>
      <div style={contactPageStyles.content}>
        
        {/* Header */}
        <div style={contactPageStyles.header}>
          <h1 style={contactPageStyles.title}>Contact</h1>
          <p style={contactPageStyles.subtitle}>
            Sunt aici să răspund la întrebările tale. Contactează-mă prin oricare dintre metodele de mai jos.
          </p>
        </div>

        <div style={contactPageStyles.mainGrid}>
          
          {/* Contact Info */}
          <div style={contactPageStyles.contactInfoCard}>
            <h2 style={contactPageStyles.cardTitle}>
              Informații de contact
            </h2>

            {/* Email */}
            <div style={contactPageStyles.contactItem}>
              <div style={{
                ...contactPageStyles.contactIcon,
                backgroundColor: '#2563eb'
              }}>
                <Mail style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <h3 style={contactPageStyles.contactItemTitle}>Email</h3>
                <a 
                  href="mailto:raduordean@gmail.com"
                  style={contactPageStyles.contactLink}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  raduordean@gmail.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div style={contactPageStyles.contactItem}>
              <div style={{
                ...contactPageStyles.contactIcon,
                backgroundColor: '#8b5cf6'
              }}>
                <MapPin style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <h3 style={contactPageStyles.contactItemTitle}>Locație</h3>
                <p style={contactPageStyles.contactText}>
                  Cursuri online - România
                </p>
              </div>
            </div>

            {/* Hours */}
            <div style={contactPageStyles.contactItem}>
              <div style={{
                ...contactPageStyles.contactIcon,
                backgroundColor: '#f59e0b'
              }}>
                <Clock style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <h3 style={contactPageStyles.contactItemTitle}>Program</h3>
                <p style={contactPageStyles.contactText}>
                  Luni - Duminică: 08:00 - 22:00
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={contactPageStyles.contactFormCard}>
            <h2 style={contactPageStyles.cardTitle}>
              Trimite-mi un mesaj
            </h2>
            
            {/* Success Message */}
            {showSuccess && (
              <div style={contactPageStyles.successMessage}>
                ✅ Mesajul a fost trimis cu succes! Îți voi răspunde în cel mai scurt timp.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={contactPageStyles.errorMessage}>
                ❌ {error}
              </div>
            )}
            
            <form onSubmit={handleContactSubmit} style={contactPageStyles.form}>
              <div style={contactPageStyles.formRow}>
                <div>
                  <label style={contactPageStyles.label}>Nume *</label>
                  <input
                    type="text"
                    value={contactForm.nume}
                    onChange={(e) => setContactForm({...contactForm, nume: e.target.value})}
                    required
                    disabled={isLoading}
                    style={contactPageStyles.input}
                    placeholder="Numele tău"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                
                <div>
                  <label style={contactPageStyles.label}>Prenume *</label>
                  <input
                    type="text"
                    value={contactForm.prenume}
                    onChange={(e) => setContactForm({...contactForm, prenume: e.target.value})}
                    required
                    disabled={isLoading}
                    style={contactPageStyles.input}
                    placeholder="Prenumele tău"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>
              
              <div>
                <label style={contactPageStyles.label}>Email *</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                  disabled={isLoading}
                  style={contactPageStyles.input}
                  placeholder="email@exemplu.ro"
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={contactPageStyles.label}>Selectează clasa *</label>
                <select
                  value={contactForm.optiune}
                  onChange={(e) => setContactForm({...contactForm, optiune: e.target.value})}
                  required
                  disabled={isLoading}
                  style={contactPageStyles.select}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="">Alege clasa</option>
                  <option value="Clasa a 7-a">Clasa a 7-a</option>
                  <option value="Clasa a 8-a">Clasa a 8-a</option>
                </select>
              </div>
              
              <div>
                <label style={contactPageStyles.label}>Mesaj *</label>
                <textarea
                  value={contactForm.mesaj}
                  onChange={(e) => setContactForm({...contactForm, mesaj: e.target.value})}
                  required
                  disabled={isLoading}
                  rows={5}
                  style={contactPageStyles.textarea}
                  placeholder="Descrie-mi pe scurt nevoile tale și cum te pot ajuta..."
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...contactPageStyles.submitButton.base,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    Object.assign(e.target.style, contactPageStyles.submitButton.hover);
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    Object.assign(e.target.style, contactPageStyles.submitButton.base);
                  }
                }}
              >
                <Send style={{ width: '1rem', height: '1rem' }} />
                {isLoading ? 'Se trimite...' : 'Trimite mesajul'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;