import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import emailjs from '@emailjs/browser';

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
    
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setError('Configurația EmailJS nu este completă. Verifică variabilele de mediu.');
      setIsLoading(false);
      return;
    }
    
    try {
      const templateParams = {
        from_name: `${contactForm.nume} ${contactForm.prenume}`,
        from_email: contactForm.email,
        message: contactForm.mesaj,
        optiune: contactForm.optiune
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      
      setContactForm({
        nume: '',
        prenume: '',
        email: '',
        optiune: '',
        mesaj: ''
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
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

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#ff6b35';
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh' }}>
      {/* FAQ Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcd3c 100%)',
        padding: '3.75rem 0.75rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute',
          top: '-37px',
          right: '-37px',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-75px',
          left: '-75px',
          width: '225px',
          height: '225px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(45px)'
        }}></div>

        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '800',
            color: '#000000',
            marginBottom: '3rem',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '-0.02em'
          }}>
            Întrebări frecvente
          </h1>

          <div style={{ 
            maxWidth: '675px', 
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            {questions.map((q) => {
              const gradients = {
                1: 'linear-gradient(135deg, #ff6b35, #dc2626)',
                2: 'linear-gradient(135deg, #f7931e, #ffcd3c)',
                3: 'linear-gradient(135deg, #ffcd3c, #ff6b35)',
                4: 'linear-gradient(135deg, #dc2626, #ff6b35)'
              };

              return (
                <div key={q.id} style={{ 
                  marginBottom: '1.125rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div 
                    onClick={() => toggleQuestion(q.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'clamp(0.75rem, 2vw, 1.125rem)', 
                      cursor: 'pointer',
                      padding: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                      transition: 'all 0.3s ease',
                      background: activeQuestion === q.id ? 'linear-gradient(90deg, #ff6b35, #f7931e)' : 'transparent'
                    }}
                  >
                    <div style={{
                      background: activeQuestion === q.id ? '#000000' : gradients[q.id],
                      color: 'white',
                      padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                      fontWeight: '700',
                      minWidth: 'clamp(35px, 8vw, 45px)',
                      height: 'clamp(35px, 8vw, 45px)',
                      textAlign: 'center',
                      borderRadius: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 3px 12px rgba(0, 0, 0, 0.2)',
                      flexShrink: 0
                    }}>
                      {q.id.toString().padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: 'clamp(0.875rem, 2.2vw, 1.05rem)',
                        color: activeQuestion === q.id ? '#ffffff' : '#000000',
                        margin: '0',
                        fontWeight: '600',
                        transition: 'color 0.3s ease',
                        lineHeight: '1.3'
                      }}>
                        {q.question}
                      </h3>
                    </div>
                    <div style={{ 
                      color: activeQuestion === q.id ? '#ffffff' : '#666666',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}>
                      {activeQuestion === q.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                  {activeQuestion === q.id && (
                    <div style={{
                      padding: 'clamp(1rem, 3vw, 1.5rem) clamp(0.875rem, 2.5vw, 1.125rem) clamp(1.25rem, 3.5vw, 1.875rem) clamp(0.875rem, 2.5vw, 1.125rem)',
                      fontSize: 'clamp(0.75rem, 1.8vw, 0.825rem)',
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
      <section style={{
        background: 'linear-gradient(135deg, #000000 0%, #1f1f1f 100%)',
        color: 'white',
        padding: 'clamp(2rem, 5vw, 2.5rem) 1rem', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 'clamp(60px, 15vw, 100px)', 
          height: 'clamp(60px, 15vw, 100px)',
          background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
          borderRadius: '50%',
          opacity: '0.1',
          filter: 'blur(33px)' 
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: 'clamp(80px, 20vw, 134px)', 
          height: 'clamp(80px, 20vw, 134px)',
          background: 'linear-gradient(45deg, #ffcd3c, #dc2626)',
          borderRadius: '50%',
          opacity: '0.1',
          filter: 'blur(40px)' 
        }}></div>

        <div style={{ 
          maxWidth: '536px', 
          margin: '0 auto', 
          position: 'relative', 
          zIndex: 10,
          padding: '0 1rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.35rem)', 
            fontWeight: '800',
            marginBottom: 'clamp(1.5rem, 3vw, 2rem)', 
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
              padding: 'clamp(0.5rem, 1.5vw, 0.67rem)', 
              borderRadius: '8px', 
              marginBottom: 'clamp(1rem, 2.5vw, 1.34rem)', 
              fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)', 
              fontWeight: '500',
              textAlign: 'center',
              backdropFilter: 'blur(5px)'
            }}>
              ✅ Mesajul a fost trimis cu succes!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #ef4444',
              color: '#ef4444',
              padding: 'clamp(0.5rem, 1.5vw, 0.67rem)',
              borderRadius: '8px',
              marginBottom: 'clamp(1rem, 2.5vw, 1.34rem)',
              fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
              fontWeight: '500',
              textAlign: 'center',
              backdropFilter: 'blur(5px)'
            }}>
              ❌ {error}
            </div>
          )}
          
          <div style={{
            display: 'grid',
            gap: 'clamp(0.75rem, 2vw, 1rem)', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: 'clamp(1.5rem, 3vw, 2rem)', 
            borderRadius: '13px', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
              gap: 'clamp(0.5rem, 1.5vw, 0.67rem)' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 'clamp(0.25rem, 0.7vw, 0.34rem)', 
                  fontWeight: '600',
                  fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)', 
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
                    padding: 'clamp(0.5rem, 1.5vw, 0.67rem)', 
                    borderRadius: '8px',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)', 
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
                  marginBottom: 'clamp(0.25rem, 0.7vw, 0.34rem)',
                  fontWeight: '600',
                  fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)',
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
                    padding: 'clamp(0.5rem, 1.5vw, 0.67rem)',
                    borderRadius: '8px',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)',
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
                marginBottom: 'clamp(0.25rem, 0.7vw, 0.34rem)',
                fontWeight: '600',
                fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)',
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
                  padding: 'clamp(0.5rem, 1.5vw, 0.67rem)',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)',
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
                marginBottom: 'clamp(0.25rem, 0.7vw, 0.34rem)',
                fontWeight: '600',
                fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)',
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
                  padding: 'clamp(0.5rem, 1.5vw, 0.67rem)',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)',
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
                marginBottom: 'clamp(0.25rem, 0.7vw, 0.34rem)',
                fontWeight: '600',
                fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)',
                color: '#f7931e' 
              }}>
                Mesaj *
              </label>
              <textarea
                value={contactForm.mesaj}
                onChange={(e) => setContactForm({...contactForm, mesaj: e.target.value})}
                required
                disabled={isLoading}
                rows={3} 
                style={{
                  width: '100%',
                  padding: 'clamp(0.5rem, 1.5vw, 0.67rem)',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  fontSize: 'clamp(0.7rem, 1.6vw, 0.75rem)',
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
                padding: 'clamp(0.6rem, 1.8vw, 0.8rem) clamp(1rem, 2.5vw, 1.34rem)', 
                borderRadius: '8px',
                fontSize: 'clamp(0.65rem, 1.5vw, 0.74rem)', 
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(0.25rem, 0.7vw, 0.34rem)',
                marginTop: 'clamp(0.5rem, 1.3vw, 0.67rem)',
                boxShadow: isLoading ? 'none' : '0 5px 21px rgba(255, 107, 53, 0.3)', 
                fontFamily: "'Poppins', sans-serif",
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 8px 27px rgba(255, 107, 53, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 5px 21px rgba(255, 107, 53, 0.3)';
                }
              }}
            >
              <Send style={{ width: 'clamp(0.5rem, 1.3vw, 0.67rem)', height: 'clamp(0.5rem, 1.3vw, 0.67rem)' }} />
              {isLoading ? 'Se trimite...' : 'Trimite mesajul'}
            </button>
          </div>
        </div>
      </section>

      <style>
        {`
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

          /* Mobile optimizations */
          @media (max-width: 768px) {
            .faq-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FAQPage;