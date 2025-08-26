import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, MapPin, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';

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

// Stilurile responsive
const contactPageStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcd3c 100%)',
    padding: '6rem 1rem 4rem',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      padding: '4rem 1rem 2rem'
    }
  },

  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10
  },

  header: {
    textAlign: 'center',
    marginBottom: '4rem',
    '@media (max-width: 768px)': {
      marginBottom: '2rem'
    }
  },

  title: {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#000000',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '2.5rem'
    },
    '@media (max-width: 480px)': {
      fontSize: '2rem'
    }
  },

  subtitle: {
    fontSize: '1.2rem',
    color: '#000000',
    maxWidth: '600px',
    margin: '0 auto',
    fontWeight: '500',
    opacity: '0.8',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      padding: '0 1rem'
    }
  },

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'start',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem'
    }
  },

  contactInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    '@media (max-width: 768px)': {
      padding: '1.5rem'
    }
  },

  contactFormCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    '@media (max-width: 768px)': {
      padding: '1.5rem'
    }
  },

  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '2rem',
    color: '#000000',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
      marginBottom: '1.5rem'
    }
  },

  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      padding: '1rem',
      marginBottom: '1.5rem'
    }
  },

  contactIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      width: '40px',
      height: '40px'
    }
  },

  contactItemTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 0.25rem 0',
    color: '#000000',
    '@media (max-width: 768px)': {
      fontSize: '1rem'
    }
  },

  contactLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    wordBreak: 'break-all',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem'
    }
  },

  contactText: {
    color: '#374151',
    margin: '0',
    fontSize: '1rem',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem'
    }
  },

  successMessage: {
    backgroundColor: 'rgba(240, 249, 255, 0.9)',
    border: '2px solid #10b981',
    color: '#065f46',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
      padding: '0.75rem'
    }
  },

  errorMessage: {
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
    border: '2px solid #ef4444',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
      padding: '0.75rem'
    }
  },

  form: {
    display: 'grid',
    gap: '1.5rem',
    '@media (max-width: 768px)': {
      gap: '1rem'
    }
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '1rem'
    }
  },

  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#374151',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem'
    }
  },

  input: {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      padding: '0.75rem',
      fontSize: '16px'
    }
  },

  select: {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      padding: '0.75rem',
      fontSize: '16px'
    }
  },

  textarea: {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      padding: '0.75rem',
      fontSize: '16px',
      minHeight: '120px'
    }
  },

  submitButton: {
    base: {
      background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      color: 'white',
      border: 'none',
      padding: '1.2rem 2rem',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
      boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
      '@media (max-width: 768px)': {
        padding: '1rem 1.5rem',
        fontSize: '1rem'
      }
    },
    hover: {
      background: 'linear-gradient(135deg, #e55a2b, #e6851a)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4)'
    }
  }
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
                  href="mailto:raduordean@gmail.com"
                  style={getResponsiveStyle(contactPageStyles.contactLink)}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  raduordean@gmail.com
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
                  Luni - Duminică: 08:00 - 22:00
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