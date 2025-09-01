import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, MapPin, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';

import { contactPageStyles } from './ContactPageStyles';


// Custom hook pentru aplicarea stilurilor responsive
const useResponsiveStyles = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Aplică media queries manual pentru fiecare stil
  const getResponsiveStyle = (style) => {
    if (!style) return {};
    
    let responsiveStyle = { ...style };
    
    // Mobile styles (max-width: 768px)
    if (windowWidth <= 768 && style['@media (max-width: 768px)']) {
      responsiveStyle = { ...responsiveStyle, ...style['@media (max-width: 768px)'] };
    }
    
    // Small mobile styles (max-width: 480px)
    if (windowWidth <= 480 && style['@media (max-width: 480px)']) {
      responsiveStyle = { ...responsiveStyle, ...style['@media (max-width: 480px)'] };
    }
    
    // Curăță media queries din stilul final
    delete responsiveStyle['@media (max-width: 768px)'];
    delete responsiveStyle['@media (max-width: 480px)'];
    
    return responsiveStyle;
  };

  return { windowWidth, getResponsiveStyle };
};

const ContactPage = () => {
  const { windowWidth, getResponsiveStyle } = useResponsiveStyles();
  
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
    <div style={getResponsiveStyle(contactPageStyles.container)}>
      <div style={getResponsiveStyle(contactPageStyles.content)}>
        
        {/* Header */}
        <div style={getResponsiveStyle(contactPageStyles.header)}>
          <h1 style={getResponsiveStyle(contactPageStyles.title)}>Contact</h1>
          <p style={getResponsiveStyle(contactPageStyles.subtitle)}>
            Sunt aici să răspund la întrebările tale. Contactează-mă prin oricare dintre metodele de mai jos.
          </p>
        </div>

        <div style={getResponsiveStyle(contactPageStyles.mainGrid)}>
          
          {/* Contact Info */}
          <div style={getResponsiveStyle(contactPageStyles.contactInfoCard)}>
            <h2 style={getResponsiveStyle(contactPageStyles.cardTitle)}>
              Informații de contact
            </h2>

            {/* Email */}
            <div style={getResponsiveStyle(contactPageStyles.contactItem)}>
              <div style={{
                ...getResponsiveStyle(contactPageStyles.contactIcon),
                backgroundColor: '#2563eb'
              }}>
                <Mail style={{ 
                  width: windowWidth <= 768 ? '1.2rem' : '1.5rem', 
                  height: windowWidth <= 768 ? '1.2rem' : '1.5rem', 
                  color: 'white' 
                }} />
              </div>
              <div>
                <h3 style={getResponsiveStyle(contactPageStyles.contactItemTitle)}>Email</h3>
                <a 
                  href="mailto:infinitymath@gmail.com"
                  style={getResponsiveStyle(contactPageStyles.contactLink)}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  infinitymath@gmail.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div style={getResponsiveStyle(contactPageStyles.contactItem)}>
              <div style={{
                ...getResponsiveStyle(contactPageStyles.contactIcon),
                backgroundColor: '#8b5cf6'
              }}>
                <MapPin style={{ 
                  width: windowWidth <= 768 ? '1.2rem' : '1.5rem', 
                  height: windowWidth <= 768 ? '1.2rem' : '1.5rem', 
                  color: 'white' 
                }} />
              </div>
              <div>
                <h3 style={getResponsiveStyle(contactPageStyles.contactItemTitle)}>Locație</h3>
                <p style={getResponsiveStyle(contactPageStyles.contactText)}>
                  Cursuri online - România
                </p>
              </div>
            </div>

            {/* Hours */}
            <div style={getResponsiveStyle(contactPageStyles.contactItem)}>
              <div style={{
                ...getResponsiveStyle(contactPageStyles.contactIcon),
                backgroundColor: '#f59e0b'
              }}>
                <Clock style={{ 
                  width: windowWidth <= 768 ? '1.2rem' : '1.5rem', 
                  height: windowWidth <= 768 ? '1.2rem' : '1.5rem', 
                  color: 'white' 
                }} />
              </div>
              <div>
                <h3 style={getResponsiveStyle(contactPageStyles.contactItemTitle)}>Program</h3>
                <p style={getResponsiveStyle(contactPageStyles.contactText)}>
                  Luni - Duminică: 09:00 - 21:00
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={getResponsiveStyle(contactPageStyles.contactFormCard)}>
            <h2 style={getResponsiveStyle(contactPageStyles.cardTitle)}>
              Trimite-mi un mesaj
            </h2>
            
            {/* Success Message */}
            {showSuccess && (
              <div style={getResponsiveStyle(contactPageStyles.successMessage)}>
                ✅ Mesajul a fost trimis cu succes! Îți voi răspunde în cel mai scurt timp.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={getResponsiveStyle(contactPageStyles.errorMessage)}>
                ❌ {error}
              </div>
            )}
            
            <form onSubmit={handleContactSubmit} style={getResponsiveStyle(contactPageStyles.form)}>
              <div style={getResponsiveStyle(contactPageStyles.formRow)}>
                <div>
                  <label style={getResponsiveStyle(contactPageStyles.label)}>Nume *</label>
                  <input
                    type="text"
                    value={contactForm.nume}
                    onChange={(e) => setContactForm({...contactForm, nume: e.target.value})}
                    required
                    disabled={isLoading}
                    style={getResponsiveStyle(contactPageStyles.input)}
                    placeholder="Numele tău"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                  />
                </div>
                
                <div>
                  <label style={getResponsiveStyle(contactPageStyles.label)}>Prenume *</label>
                  <input
                    type="text"
                    value={contactForm.prenume}
                    onChange={(e) => setContactForm({...contactForm, prenume: e.target.value})}
                    required
                    disabled={isLoading}
                    style={getResponsiveStyle(contactPageStyles.input)}
                    placeholder="Prenumele tău"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                  />
                </div>
              </div>
              
              <div>
                <label style={getResponsiveStyle(contactPageStyles.label)}>Email *</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                  disabled={isLoading}
                  style={getResponsiveStyle(contactPageStyles.input)}
                  placeholder="email@exemplu.ro"
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                />
              </div>
              
              <div>
                <label style={getResponsiveStyle(contactPageStyles.label)}>Selectează clasa *</label>
                <select
                  value={contactForm.optiune}
                  onChange={(e) => setContactForm({...contactForm, optiune: e.target.value})}
                  required
                  disabled={isLoading}
                  style={getResponsiveStyle(contactPageStyles.select)}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                >
                  <option value="">Alege clasa</option>
                  <option value="Clasa a 7-a">Clasa a 7-a</option>
                  <option value="Clasa a 8-a">Clasa a 8-a</option>
                </select>
              </div>
              
              <div>
                <label style={getResponsiveStyle(contactPageStyles.label)}>Mesaj *</label>
                <textarea
                  value={contactForm.mesaj}
                  onChange={(e) => setContactForm({...contactForm, mesaj: e.target.value})}
                  required
                  disabled={isLoading}
                  rows={windowWidth <= 768 ? 4 : 5}
                  style={getResponsiveStyle(contactPageStyles.textarea)}
                  placeholder="Descrie-mi pe scurt nevoile tale și cum te pot ajuta..."
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...getResponsiveStyle(contactPageStyles.submitButton.base),
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={(e) => {
                  if (!isLoading && windowWidth > 768) {
                    Object.assign(e.target.style, contactPageStyles.submitButton.hover);
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    Object.assign(e.target.style, getResponsiveStyle(contactPageStyles.submitButton.base));
                  }
                }}
              >
                <Send style={{ width: '1rem', height: '1rem' }} />
                {isLoading ? 'Se trimite...' : 'Trimite mesajul'}
              </button>
            </form>

          </div>
        </div>

        {/* Background decorations - doar pe desktop */}
        {windowWidth > 768 && (
          <>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              zIndex: 1
            }}></div>
            
            <div style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-100px',
              width: '300px',
              height: '300px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              zIndex: 1
            }}></div>
            
            <div style={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: '150px',
              height: '150px',
              background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
              borderRadius: '50%',
              opacity: '0.1',
              filter: 'blur(50px)',
              zIndex: 1
            }}></div>
            
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '10%',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(45deg, #ffcd3c, #dc2626)',
              borderRadius: '50%',
              opacity: '0.1',
              filter: 'blur(60px)',
              zIndex: 1
            }}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactPage;