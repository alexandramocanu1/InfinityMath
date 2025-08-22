import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { faqPageStyles } from './FAQPageStyles';

const FAQPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [contactForm, setContactForm] = useState({
    nume: '',
    prenume: '',
    email: '',
    optiune: '',
    mesaj: ''
  });

  // State pentru EmailJS
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Configurează EmailJS din variabilele de mediu
  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  // Date pentru întrebări
  const questions = [
    {
      id: 1,
      question: "Cum se desfășoară un curs?",
      answer: "Cursurile mele de matematică au loc săptămânal, online, și sunt dedicate pregătirii pentru Evaluarea Națională și Bacalaureat. Fiecare sesiune durează aproximativ 90 de minute și se desfășoară în direct, cu posibilitatea de a pune întrebări și de a interacționa."
    },
    {
      id: 2,
      question: "Cursurile sunt interactive?",
      answer: "Da. Pe parcursul lecțiilor, mențin un dialog constant cu elevii. Vei fi încurajat să fii curios, să pui întrebări și să participi activ. Poți interveni oricând pentru a-ți clarifica conceptele sau pentru a contribui la discuție."
    },
    {
      id: 3,
      question: "Cursurile urmează programa școlară?",
      answer: "Cursurile mele sunt aliniate integral cu programa școlară pentru clasa a VIII-a. Pun accent pe pregătirea pentru Evaluarea Națională, astfel încât fiecare lecție vizează exact competențele și conținuturile care se regăsesc în examen."
    },
    {
      id: 4,
      question: "De ce să alegi cursurile mele?",
      answer: "Pentru că te ajută să obții rezultate reale: note mai bune, performanțe la examene și încredere în propriile abilități.\n\nCursurile sunt construite cu grijă, orientate spre calitate și adaptate nevoilor elevilor de gimnaziu.\n\nVei învăța să gândești clar, structurat, creativ – și să îți folosești logica pentru a rezolva orice provocare."
    }
  ];

  const handleContactSubmit = async () => {
    // Validare minimă
    if (!contactForm.nume || !contactForm.prenume || !contactForm.email || 
        !contactForm.optiune || !contactForm.mesaj) {
      setError('Te rog completează toate câmpurile obligatorii.');
      return;
    }

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

  const toggleQuestion = (questionNumber) => {
    if (activeQuestion === questionNumber) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(questionNumber);
    }
  };

  // Handlers pentru interacțiuni
  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#ff6b35';
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
  };

  const handleButtonHover = (e, isHovering) => {
    if (!isLoading) {
      if (isHovering) {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 12px 40px rgba(255, 107, 53, 0.4)';
      } else {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 8px 32px rgba(255, 107, 53, 0.3)';
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh' }}>
      {/* FAQ Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcd3c 100%)',
        padding: '5rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '800',
            color: '#000000',
            marginBottom: '4rem',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '-0.02em'
          }}>
            Întrebări frecvente
          </h1>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {questions.map((q) => {
              const gradients = {
                1: 'linear-gradient(135deg, #ff6b35, #dc2626)',
                2: 'linear-gradient(135deg, #f7931e, #ffcd3c)',
                3: 'linear-gradient(135deg, #ffcd3c, #ff6b35)',
                4: 'linear-gradient(135deg, #dc2626, #ff6b35)'
              };

              return (
                <div key={q.id} style={{ 
                  marginBottom: '1.5rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div 
                    onClick={() => toggleQuestion(q.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1.5rem', 
                      cursor: 'pointer',
                      padding: '1.5rem',
                      transition: 'all 0.3s ease',
                      background: activeQuestion === q.id ? 'linear-gradient(90deg, #ff6b35, #f7931e)' : 'transparent'
                    }}
                  >
                    <div style={{
                      background: activeQuestion === q.id ? '#000000' : gradients[q.id],
                      color: 'white',
                      padding: '1rem',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      minWidth: '60px',
                      height: '60px',
                      textAlign: 'center',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                    }}>
                      {q.id.toString().padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.4rem',
                        color: activeQuestion === q.id ? '#ffffff' : '#000000',
                        margin: '0',
                        fontWeight: '600',
                        transition: 'color 0.3s ease'
                      }}>
                        {q.question}
                      </h3>
                    </div>
                    <div style={{ 
                      color: activeQuestion === q.id ? '#ffffff' : '#666666',
                      transition: 'all 0.3s ease'
                    }}>
                      {activeQuestion === q.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                  {activeQuestion === q.id && (
                    <div style={{
                      padding: '2rem 1.5rem 2.5rem 1.5rem',
                      fontSize: '1.1rem',
                      lineHeight: '1.7',
                      color: '#374151',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      animation: 'slideDown 0.3s ease-out'
                    }}>
                      {q.answer.split('\n\n').map((paragraph, index) => (
                        <React.Fragment key={index}>
                          {paragraph}
                          {index < q.answer.split('\n\n').length - 1 && <><br /><br /></>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div style={{
        background: 'linear-gradient(135deg, #000000 0%, #1f1f1f 100%)',
        color: 'white',
        padding: '6rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
          borderRadius: '50%',
          opacity: '0.1',
          filter: 'blur(50px)'
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
          filter: 'blur(60px)'
        }}></div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '3rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ff6b35, #f7931e, #ffcd3c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            Când începem?
          </h2>
          
          {/* Success Message */}
          {showSuccess && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid #10b981',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              textAlign: 'center',
              backdropFilter: 'blur(5px)'
            }}>
              ✅ Mesajul a fost trimis cu succes! Îți voi răspunde în cel mai scurt timp.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #ef4444',
              color: '#ef4444',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              textAlign: 'center',
              backdropFilter: 'blur(5px)'
            }}>
              ❌ {error}
            </div>
          )}
          
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '3rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#f7931e' 
                }}>
                  Nume *
                </label>
                <input
                  type="text"
                  value={contactForm.nume}
                  onChange={(e) => setContactForm({...contactForm, nume: e.target.value})}
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Poppins', sans-serif",
                    opacity: isLoading ? 0.7 : 1
                  }}
                  placeholder="Numele tău"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#f7931e' 
                }}>
                  Prenume *
                </label>
                <input
                  type="text"
                  value={contactForm.prenume}
                  onChange={(e) => setContactForm({...contactForm, prenume: e.target.value})}
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Poppins', sans-serif",
                    opacity: isLoading ? 0.7 : 1
                  }}
                  placeholder="Prenumele tău"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#f7931e' 
              }}>
                Email *
              </label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Poppins', sans-serif",
                  opacity: isLoading ? 0.7 : 1
                }}
                placeholder="email@exemplu.ro"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#f7931e' 
              }}>
                Selectează clasa *
              </label>
              <select
                value={contactForm.optiune}
                onChange={(e) => setContactForm({...contactForm, optiune: e.target.value})}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Poppins', sans-serif",
                  opacity: isLoading ? 0.7 : 1
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                <option value="" style={{ backgroundColor: '#1f1f1f', color: '#ffffff' }}>Alege clasa</option>
                <option value="Clasa a 7-a" style={{ backgroundColor: '#1f1f1f', color: '#ffffff' }}>Clasa a 7-a</option>
                <option value="Clasa a 8-a" style={{ backgroundColor: '#1f1f1f', color: '#ffffff' }}>Clasa a 8-a</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#f7931e' 
              }}>
                Mesaj *
              </label>
              <textarea
                value={contactForm.mesaj}
                onChange={(e) => setContactForm({...contactForm, mesaj: e.target.value})}
                required
                disabled={isLoading}
                rows={4}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Poppins', sans-serif",
                  opacity: isLoading ? 0.7 : 1
                }}
                placeholder="Descrie-mi pe scurt nevoile tale și cum te pot ajuta..."
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
            
            <button
              onClick={handleContactSubmit}
              disabled={isLoading}
              style={{
                background: isLoading ? 'rgba(156, 163, 175, 0.8)' : 'linear-gradient(135deg, #ff6b35, #f7931e)',
                color: 'white',
                border: 'none',
                padding: '1.2rem 2rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                boxShadow: isLoading ? 'none' : '0 8px 32px rgba(255, 107, 53, 0.3)',
                fontFamily: "'Poppins', sans-serif",
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseOver={(e) => handleButtonHover(e, true)}
              onMouseOut={(e) => handleButtonHover(e, false)}
            >
              <Send style={{ width: '1rem', height: '1rem' }} />
              {isLoading ? 'Se trimite...' : 'Trimite mesajul'}
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          
          @keyframes slideDown {
            from { 
              opacity: 0; 
              transform: translateY(-20px); 
              maxHeight: 0;
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
              maxHeight: 500px;
            }
          }

          input::placeholder,
          textarea::placeholder,
          select {
            color: rgba(255, 255, 255, 0.6) !important;
          }

          /* Responsive design */
          @media (max-width: 768px) {
            h1 {
              fontSize: 2.5rem !important;
            }
            
            h2 {
              fontSize: 2.5rem !important;
            }
            
            .grid-two-cols {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FAQPage;