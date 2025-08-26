import React, { useState } from 'react';
import { BookOpen, ArrowRight, X, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { homePageStyles } from './HomePageStyles';

const HomePage = ({ setCurrentPage, setSelectedService }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const services = [
    {
      id: 'evaluare',
      name: 'Clasa a 7-a',
      price: '60 RON / Sesiune',
      duration: '1h 30 min',
      color: '#f59e0b'
    },
    //Aici de adaugat si ceva mai mic ca de fapt e 240 pe luna ca sa nu fie misleading
    {
      id: 'bac',
      name: 'Clasa a 8-a', 
      price: '60 RON / Sesiune',
      duration: '1h 30 min',
      color: '#ea580c'
    }
  ];

  const reviews = [
    { id: 1, image: 'review.png', alt: 'Review WhatsApp 1' },
    { id: 2, image: 'review_2.png', alt: 'Review WhatsApp 2' },
    { id: 3, image: 'review_3.png', alt: 'Review WhatsApp 3' },
    { id: 4, image: 'review_4.png', alt: 'Review WhatsApp 4' },
    { id: 5, image: 'review_5.png', alt: 'Review WhatsApp 5' },
    { id: 6, image: 'review_6.png', alt: 'Review WhatsApp 6' },
    { id: 7, image: 'review_7.png', alt: 'Review WhatsApp 7' }
  ];

  const handleServiceSelect = (serviceId) => {
    if (services.find(s => s.id === serviceId)?.available === false) return;
    setSelectedService(serviceId);
    setCurrentPage('services');
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  const handleContactSubmit = async () => {
    // Validare minimă
    if (!contactForm.nume || !contactForm.prenume || !contactForm.email || 
         !contactForm.optiune) {
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
        message: contactForm.mesaj || 'Mesaj trimis de pe pagina principală',
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

  // Event listener pentru keyboard în modal
  React.useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen, currentImageIndex]);

  // Grid positions pentru review images - 7 poze în layout dreptunghiular
  const getGridPosition = (index) => {
    const gridPositions = [
      { column: 'span 1', row: 'span 1' }, // 0: 1x1
      { column: 'span 1', row: 'span 1' }, // 1: 1x1
      { column: 'span 1', row: 'span 1' }, // 2: 1x1
      { column: 'span 1', row: 'span 2' }, // 3: 1x2 (înalt)
      { column: 'span 1', row: 'span 1' }, // 4: 1x1
      { column: 'span 1', row: 'span 1' }, // 5: 1x1
      { column: 'span 1', row: 'span 1' }, // 6: 1x1
    ];
    return gridPositions[index] || { column: 'span 1', row: 'span 1' };
  };

  return (
    <>
      <style>{homePageStyles.globalStyles}</style>
      
      <div style={homePageStyles.container}>
        {/* Hero Section */}
        <section style={homePageStyles.heroSection}>
          <h1 style={homePageStyles.heroTitle}>
            Pregătire pentru Bac și Evaluare Națională
          </h1>
          
          <p style={homePageStyles.heroSubtitle}>
            Construim impreuna drumul spre succes! 
          </p>

          <button
            onClick={() => setCurrentPage('services')}
            style={homePageStyles.heroButton.base}
            onMouseOver={(e) => Object.assign(e.target.style, homePageStyles.heroButton.hover)}
            onMouseOut={(e) => Object.assign(e.target.style, homePageStyles.heroButton.base)}
          >
            Înscrie-te acum
          </button>
        </section>

        {/* Cursuri Online Section */}
<section style={homePageStyles.servicesSection}>
  <div style={homePageStyles.maxWidth}>
    <div style={homePageStyles.sectionHeader}>
      <h2 style={homePageStyles.sectionTitle}>Cursuri Online</h2>
      <p style={homePageStyles.sectionSubtitle}>
        Alege programul potrivit pentru tine
      </p>
    </div>

    <div style={homePageStyles.servicesGrid}>
      {services.map((service) => (
        <div 
          key={service.id} 
          style={{
            ...homePageStyles.serviceCard.base,
            opacity: service.available !== false ? 1 : 0.6,
            cursor: service.available !== false ? 'pointer' : 'not-allowed'
          }}
          onClick={() => handleServiceSelect(service.id)}
          onMouseOver={(e) => {
            if (service.available !== false) {
              Object.assign(e.currentTarget.style, homePageStyles.serviceCard.hover);
            }
          }}
          onMouseOut={(e) => {
            if (service.available !== false) {
              Object.assign(e.currentTarget.style, homePageStyles.serviceCard.base);
            }
          }}
        >
          <div style={{
            ...homePageStyles.serviceIcon,
            backgroundColor: 'transparent',
            boxShadow: 'none'
          }}>
            <img 
              src={service.id === 'evaluare' ? '/images/logo_VII_2.png' : '/images/logo_VIII_2.png'}
              alt={service.name}
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          </div>
          
          <h3 style={homePageStyles.serviceTitle}>{service.name}</h3>
          
          <p style={homePageStyles.serviceDescription}>
            {service.description}
          </p>
          
          <div style={homePageStyles.servicePricing}>
            <div style={{
              ...homePageStyles.servicePrice,
              color: service.available !== false ? service.color : '#9ca3af'
            }}>
              {service.price}
            </div>
            <div style={homePageStyles.serviceDuration}>
              {service.duration} / sesiune
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleServiceSelect(service.id);
            }}
            style={{
              ...homePageStyles.serviceButton.base,
              backgroundColor: service.available !== false ? service.color : '#d1d5db',
              cursor: service.available !== false ? 'pointer' : 'not-allowed'
            }}
            onMouseOver={(e) => {
              if (service.available !== false) {
                e.target.style.opacity = '0.9';
              }
            }}
            onMouseOut={(e) => {
              if (service.available !== false) {
                e.target.style.opacity = '1';
              }
            }}
          >
            {service.available !== false ? 'Selectează' : 'Indisponibil'}
          </button>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* Cine sunt Section */}
        <section style={homePageStyles.aboutSection}>
          <div style={homePageStyles.maxWidth}>
            <h2 style={homePageStyles.aboutTitle}>Cine sunt?</h2>
            
            <div style={homePageStyles.aboutGrid}>
              <div style={homePageStyles.aboutImageContainer}>
                <img 
                  src="/images/profil.png" 
                  alt="Radu Ordean - Profesor de Matematică"
                  style={homePageStyles.aboutImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={homePageStyles.aboutImageFallback}>👨‍🏫</div>
              </div>
              
              <div>
                <p style={homePageStyles.aboutText}>
                  Sunt <strong>cadru didactic asociat</strong> la Universitatea din București și la 
                  Universitatea Politehnică din București, unde susțin seminare pentru studenți. 
                  În prezent, sunt <strong>doctorand în matematică</strong>.
                </p>
                
                <div style={homePageStyles.aboutDivider} />
                
                <p style={homePageStyles.aboutText}>
                  Am lucrat cu <strong>peste o sută de elevi</strong>, având o experiență de 
                  <strong> peste 7 ani</strong> în pregătirea elevilor pentru <strong>Evaluarea Națională și Bacalaureat</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ce, când și cum Section */}
        <section style={homePageStyles.howSection}>
          <div style={homePageStyles.howContainer}>
            <h2 style={homePageStyles.howTitle}>Ce, când și cum?</h2>
            
            <p style={homePageStyles.howText}>
              Cursurile mele de matematică au loc <strong>săptămânal, online</strong>, și sunt dedicate 
              pregătirii pentru <strong>Evaluarea Națională și Bacalaureat</strong>. Fiecare sesiune 
              durează aproximativ <strong>90 de minute</strong> și se desfășoară online, live pe Google Meet, cu posibilitatea 
              de a pune întrebări și de a interacționa.
            </p>
            
            <button
              onClick={() => setCurrentPage('faq')}
              style={homePageStyles.howButton.base}
              onMouseOver={(e) => Object.assign(e.target.style, homePageStyles.howButton.hover)}
              onMouseOut={(e) => Object.assign(e.target.style, homePageStyles.howButton.base)}
            >
              Află mai multe
            </button>
          </div>
        </section>

        {/* Reviews Section */}
        <section style={homePageStyles.reviewsSection}>
          <div style={homePageStyles.reviewsBackground.decoration1}></div>
          <div style={homePageStyles.reviewsBackground.decoration2}></div>

          <div style={homePageStyles.reviewsContainer}>
            <h2 style={homePageStyles.reviewsTitle}>
              Ce spun elevii și părinții?
            </h2>
            
            <div style={homePageStyles.reviewsGrid}>
              {reviews.map((review, index) => (
                <div 
                  key={review.id} 
                  style={{
                    ...homePageStyles.reviewItem.base,
                    // Înălțimi variate pentru un aspect masonry
                    height: index % 4 === 0 ? '280px' : 
                          index % 3 === 0 ? '220px' : 
                          index % 2 === 0 ? '240px' : '200px'
                  }}
                >
                  <img 
                    src={`/images/${review.image}`}
                    alt={review.alt}
                    style={homePageStyles.reviewImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section style={{
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
                ✅ Mesajul a fost trimis cu succes!
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
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ff6b35';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
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
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ff6b35';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
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
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b35';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
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
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b35';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
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
                  Mesaj
                </label>
                <textarea
                  value={contactForm.mesaj}
                  onChange={(e) => setContactForm({...contactForm, mesaj: e.target.value})}
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
                  placeholder="Întrebări despre lecții? Trimiteți un mesaj..."
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b35';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
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
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(255, 107, 53, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(255, 107, 53, 0.3)';
                  }
                }}
              >
                <Send style={{ width: '1rem', height: '1rem' }} />
                {isLoading ? 'Se trimite...' : 'Trimite mesajul'}
              </button>
            </div>
          </div>
        </section>

        {/* Modal pentru imagini */}
        {isModalOpen && (
          <div style={homePageStyles.modal.overlay}>
            <button
              onClick={closeModal}
              style={homePageStyles.modal.closeButton}
            >
              <X style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </button>

            <button
              onClick={goToPrevious}
              style={homePageStyles.modal.prevButton}
            >
              <ChevronLeft style={{ width: '2rem', height: '2rem', color: 'white' }} />
            </button>

            <button
              onClick={goToNext}
              style={homePageStyles.modal.nextButton}
            >
              <ChevronRight style={{ width: '2rem', height: '2rem', color: 'white' }} />
            </button>

            <div style={homePageStyles.modal.imageContainer}>
              <img
                src={`/images/${reviews[currentImageIndex]?.image}`}
                alt={reviews[currentImageIndex]?.alt}
                style={homePageStyles.modal.image}
              />
            </div>

            <div style={homePageStyles.modal.counter}>
              {currentImageIndex + 1} / {reviews.length}
            </div>

            <div 
              style={homePageStyles.modal.backdrop}
              onClick={closeModal}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
