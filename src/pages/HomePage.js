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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


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

  React.useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

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
<section style={{
  ...homePageStyles.heroSection,
  '@media (max-width: 768px)': {
    padding: '4rem 1rem',
    minHeight: '80vh'
  }
}}>
  <div style={homePageStyles.heroOverlay}></div>
  
  <h1 style={{
    ...homePageStyles.heroTitle,
    fontSize: isMobile ? '2.5rem' : '4rem',
lineHeight: isMobile ? '1.2' : '1.1'
  }}>
    Cursuri de matematică pentru gimnaziu
  </h1>
  
  <p style={{
    ...homePageStyles.heroSubtitle,
    fontSize: isMobile ? '1.2rem' : '1.5rem',
padding: isMobile ? '0 1rem' : '0'
  }}>
    Construim împreună drumul spre succes!
  </p>

  <button
    onClick={() => setCurrentPage('services')}
    style={{
      ...homePageStyles.heroButton.base,
      position: 'relative',
      zIndex: 2,
      padding: isMobile ? '1rem 2rem' : '1.2rem 3rem',
fontSize: isMobile ? '1rem' : '1.1rem'
    }}
  >
    Înscrie-te acum
  </button>
</section>

        {/* Cursuri Online Section */}
<section style={{
  padding: isMobile ? '2rem 1rem' : '3rem 1rem', 
  backgroundColor: '#ffffff',
}}>
  <div style={{
    maxWidth: '1200px', 
    margin: '0 auto'
  }}>
    <div style={{
      textAlign: 'center',
      marginBottom: '2.5rem' 
    }}>
      <h2 style={{
        fontSize: '2.25rem',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '0.5rem',
        fontFamily: 'Poppins, serif'
      }}>
        Cursuri Online
      </h2>
      <p style={{
        fontSize: '1rem',
        color: '#718096',
        marginBottom: '0'
      }}>
        Alege programul potrivit pentru tine
      </p>
    </div>

    {/* Grid cu 2 coloane egale */}
    <div style={{
  display: 'grid',
gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',  gap: '2rem',
  maxWidth: '900px', 
  margin: '0 auto'
}}>
      {services.map((service) => (
        <div 
          key={service.id} 
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '2rem', 
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: service.available !== false ? 'pointer' : 'not-allowed',
            opacity: service.available !== false ? 1 : 0.6,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '320px' 
          }}
          onClick={() => handleServiceSelect(service.id)}
          onMouseOver={(e) => {
            if (service.available !== false) {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.borderColor = service.color;
            }
          }}
          onMouseOut={(e) => {
            if (service.available !== false) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }
          }}
        >
          {/* Icon section */}
          <div style={{
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '80px', 
              height: '80px',
              margin: '0 auto',
              marginBottom: '1rem'
            }}>
              <img 
                src={service.id === 'evaluare' ? '/images/logo_VII_2.png' : '/images/logo_VIII_2.png'}
                alt={service.name}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
            
            <h3 style={{
              fontSize: '1.5rem', 
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              {service.name}
            </h3>
            
          </div>
          
          {/* Pricing section */}
<div style={{ marginBottom: '1.5rem' }}>
  {/* Prețul pe ședință */}
  <div style={{
    fontSize: '1.8rem',
    fontWeight: '700',
    color: service.available !== false ? service.color : '#9ca3af',
    marginBottom: '0.5rem'
  }}>
    60 RON / ședință
  </div>
  
  {/* Abonamentul lunar cu detalii */}
  <div style={{
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#718096',
    marginBottom: '0.2rem'
  }}>
    Abonament lunar la 240 RON
  </div>
  
  {/* Durata */}
  <div style={{
    fontSize: '0.9rem',
    color: '#718096'
  }}>
    {service.duration} / ședință
  </div>
</div>
          
          {/* Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleServiceSelect(service.id);
            }}
            style={{
              backgroundColor: service.available !== false ? service.color : '#d1d5db',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: service.available !== false ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            onMouseOver={(e) => {
              if (service.available !== false) {
                e.target.style.opacity = '0.9';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (service.available !== false) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
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
            
            <div style={{
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
  gap: isMobile ? '2rem' : '4rem',
  alignItems: 'center',
  textAlign: isMobile ? 'center' : 'left'
}}>
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
                  În prezent, urmez studiile doctorale în matematică. În paralel, îmi dedic timpul
                   și pregătirii elevilor de gimnaziu, ajutându-i să înțeleagă matematica într-un mod
                    clar și accesibil.
                </p>
                
                <div style={homePageStyles.aboutDivider} />
                
                <p style={homePageStyles.aboutText}>
                  Am lucrat față în față cu <strong>peste o sută de elevi</strong>, acumulând o experiență de <strong>peste 8 ani </strong> 
                  în pregătirea copiilor pentru <strong>Evaluarea Națională și Bacalaureat</strong>. 
                  Acum îmi doresc să duc această experiență mai departe și să ofer sprijin unui număr cât mai mare 
                  de elevi prin intermediul platformei mele Infinity Math.
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
              pregătirii pentru <strong>Evaluarea Națională</strong>. Fiecare sesiune 
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
{/* Reviews Section - Versiunea nouă */}
<section style={{
  ...homePageStyles.reviewsSection,
  padding: isMobile ? '2rem 1rem' : '3rem 1rem'
}}>
  {/* Overlay pentru vizibilitatea textului */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1
  }}></div>

  <div style={homePageStyles.reviewsBackground.decoration1}></div>
  <div style={homePageStyles.reviewsBackground.decoration2}></div>

  <div style={{
    ...homePageStyles.reviewsContainer,
    maxWidth: '1200px',
    position: 'relative',
    zIndex: 2
  }}>
    <h2 style={{
      ...homePageStyles.reviewsTitle,
      color: '#ffffff',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
    }}>
      Ce spun elevii și părinții?
    </h2>
    
    {/* Grid nou cu shadow mai mare și modal */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? 
        'repeat(auto-fit, minmax(150px, 1fr))' : 
        'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem', 
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      {reviews.map((review, index) => (
        <div 
          key={review.id} 
          onClick={() => openModal(index)}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            height: index % 4 === 0 ? '140px' : 
                   index % 3 === 0 ? '120px' : 
                   index % 2 === 0 ? '130px' : '110px',
            transform: 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 45px rgba(0, 0, 0, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.25)';
          }}
        >
          <img 
            src={`/images/${review.image}`}
            alt={review.alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain', 
              objectPosition: 'center',
              backgroundColor: 'white'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      ))}
    </div>
  </div>
</section>

{/* Modal Fullscreen */}
{isModalOpen && (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: isMobile ? '2rem 1rem' : '2rem'
    }}
    onClick={closeModal}
  >
    {/* Close Button */}
    <button
      onClick={closeModal}
      style={{
        position: 'absolute',
        top: isMobile ? '1rem' : '2rem',
        right: isMobile ? '1rem' : '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        borderRadius: '50%',
        width: isMobile ? '40px' : '50px',
        height: isMobile ? '40px' : '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 10001
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      }}
    >
      <X size={isMobile ? 20 : 24} color="white" />
    </button>

    {/* Previous Button */}
    {reviews.length > 1 && (
      <button
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
        style={{
          position: 'absolute',
          left: isMobile ? '0.5rem' : '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: isMobile ? '45px' : '60px',
          height: isMobile ? '45px' : '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 10001
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <ChevronLeft size={isMobile ? 20 : 28} color="white" />
      </button>
    )}

    {/* Next Button */}
    {reviews.length > 1 && (
      <button
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        style={{
          position: 'absolute',
          right: isMobile ? '0.5rem' : '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: isMobile ? '45px' : '60px',
          height: isMobile ? '45px' : '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 10001
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <ChevronRight size={isMobile ? 20 : 28} color="white" />
      </button>
    )}

    {/* Image Container */}
    <div 
      style={{
        maxWidth: '95%',
        maxHeight: '90%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <img 
        src={`/images/${reviews[currentImageIndex]?.image}`}
        alt={reviews[currentImageIndex]?.alt}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          borderRadius: '8px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          backgroundColor: 'white'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </div>

    {/* Counter */}
    {reviews.length > 1 && (
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '1rem' : '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: isMobile ? '0.8rem' : '0.9rem',
        backdropFilter: 'blur(10px)'
      }}>
        {currentImageIndex + 1} / {reviews.length}
      </div>
    )}
  </div>
)}


              {/* Steps Section */}
<section style={{
  padding: isMobile ? '3rem 1rem' : '4rem 2rem',
  backgroundColor: '#ffffff',
  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
}}>
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto'
  }}>
    <div style={{
      textAlign: 'center',
      marginBottom: isMobile ? '2rem' : '3rem'
    }}>
      <h2 style={{
        fontSize: isMobile ? '1.8rem' : '2.25rem',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '0.5rem',
        fontFamily: '"Poppins", Georgia, serif'
      }}>
        Alătură-te în doar 4 pași simpli 
      </h2>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
      gap: isMobile ? '2.5rem' : '2rem',
      alignItems: 'start'
    }}>
      {[
        {
          number: 1,
          title: "Creează-ți un cont",
          subtitle: "Înregistrează-te pe platformă și adaugă datele necesare.",
          image: "/images/pas_1.png"
        },
        {
          number: 2,
          title: "Alege cursurile preferate",
          subtitle: "Selectează pachetul dorit și adaugă-l în coș.",
          image: "/images/pas_2.png"
        },
        {
          number: 3,
          title: "Plătește rapid și sigur",
          subtitle: "Finalizează comanda direct pe site printr-o plată securizată cu cardul.",
          image: "/images/pas_3.png"
        },
        {
          number: 4,
          title: "Primește linkul și conectează-te",
          subtitle: "După confirmarea plății, accesează linkul de Google Meet din pagina Profilul meu pentru a te conecta la curs.",
          image: "/images/pas_4.png"
        }
      ].map((step, index) => (
        <div key={step.number} style={{
          textAlign: 'center',
          position: 'relative',
          maxWidth: isMobile ? '300px' : 'none',
          margin: isMobile ? '0 auto' : '0'
        }}>
          <div style={{
            width: isMobile ? '90px' : '100px',
            height: isMobile ? '90px' : '100px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            backgroundColor: '#ff9035',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 12px rgba(255, 144, 53, 0.3)'
          }}>
            <img 
              src={step.image}
              alt={`Pasul ${step.number}`}
              style={{
                width: isMobile ? '50px' : '60px',
                height: isMobile ? '50px' : '60px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<div style="
                  width: ${isMobile ? '45px' : '50px'};
                  height: ${isMobile ? '45px' : '50px'};
                  backgroundColor: #2d3748;
                  color: white;
                  borderRadius: 50%;
                  display: flex;
                  alignItems: center;
                  justifyContent: center;
                  fontSize: ${isMobile ? '1.3rem' : '1.5rem'};
                  fontWeight: bold;
                  fontFamily: Poppins, sans-serif;
                ">${step.number}</div>`;
              }}
            />
          </div>

          <div style={{
            fontSize: isMobile ? '1.8rem' : '2.25rem',
            fontWeight: 'bold',
            color: '#2d3748',
            marginBottom: '1rem',
            fontFamily: '"Poppins", sans-serif'
          }}>
            {step.number}.
          </div>

          <div>
            <p style={{
              fontSize: isMobile ? '1rem' : '0.9rem',
              color: '#4a5568',
              lineHeight: '1.5',
              margin: 0,
              maxWidth: isMobile ? '280px' : '200px',
              margin: '0 auto',
              fontFamily: '"Poppins", sans-serif'
            }}>
              <strong style={{ 
                fontWeight: '600',
                marginBottom: '0.5rem',
                display: 'block',
                fontSize: isMobile ? '1.1rem' : '1rem'
              }}>
                {step.title}
              </strong>
              <span style={{ 
                fontWeight: '400',
                fontSize: isMobile ? '0.95rem' : '0.85rem'
              }}>
                {step.subtitle}
              </span>
            </p>
          </div>


        </div>
      ))}
    </div>
  </div>
</section>

{/* Contact Form Section */}
<section style={{
  background: 'linear-gradient(135deg, #000000 0%, #1f1f1f 100%)',
  color: '#f5f5dc', 
  padding: '2.5rem 1rem', 
  position: 'relative',
  overflow: 'hidden'
}}>
  <div style={{
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: '100px', 
    height: '100px',
    background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
    borderRadius: '50%',
    opacity: '0.1',
    filter: 'blur(33px)' 
  }}></div>
  <div style={{
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    width: '134px', 
    height: '134px',
    background: 'linear-gradient(45deg, #ffcd3c, #dc2626)',
    borderRadius: '50%',
    opacity: '0.1',
    filter: 'blur(40px)' 
  }}></div>

  <div style={{ 
    maxWidth: '536px', 
    margin: '0 auto', 
    position: 'relative', 
    zIndex: 10 
  }}>
    <h2 style={{
  fontSize: '2.35rem', 
  fontWeight: '800',
  marginBottom: '2rem', 
  textAlign: 'center',
  color: '#f5f5dc', 
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)', 
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
        padding: '0.67rem', 
        borderRadius: '8px', 
        marginBottom: '1.34rem', 
        fontSize: '0.64rem', 
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
        padding: '0.67rem',
        borderRadius: '8px',
        marginBottom: '1.34rem',
        fontSize: '0.64rem',
        fontWeight: '500',
        textAlign: 'center',
        backdropFilter: 'blur(5px)'
      }}>
        ❌ {error}
      </div>
    )}
    
    <div style={{
      display: 'grid',
      gap: '1rem', 
      backgroundColor: 'rgba(245, 245, 220, 0.05)', // Background bej foarte transparent
      padding: '2rem', 
      borderRadius: '13px', 
      border: '1px solid rgba(245, 245, 220, 0.1)', // Border bej transparent
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '1rem' : '0.67rem'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.34rem', 
            fontWeight: '600',
            fontSize: '0.75rem', 
            color: '#f5f5dc' // Culoare bej pentru labels
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
              padding: '0.67rem', 
              borderRadius: '8px',
              border: '2px solid rgba(245, 245, 220, 0.15)', // Border bej
              fontSize: '0.75rem', 
              backgroundColor: 'rgba(245, 245, 220, 0.05)', // Background bej foarte transparent
              color: '#f5f5dc', // Text bej
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              fontFamily: "'Poppins', sans-serif",
              opacity: isLoading ? 0.7 : 1
            }}
            placeholder="Numele tău"
            onFocus={(e) => {
              e.target.style.borderColor = '#f5f5dc'; // Focus border bej
              e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(245, 245, 220, 0.15)';
              e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.05)';
            }}
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.34rem',
            fontWeight: '600',
            fontSize: '0.75rem',
            color: '#f5f5dc' // Culoare bej pentru labels
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
              padding: '0.67rem',
              borderRadius: '8px',
              border: '2px solid rgba(245, 245, 220, 0.15)',
              fontSize: '0.75rem',
              backgroundColor: 'rgba(245, 245, 220, 0.05)',
              color: '#f5f5dc',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              fontFamily: "'Poppins', sans-serif",
              opacity: isLoading ? 0.7 : 1
            }}
            placeholder="Prenumele tău"
            onFocus={(e) => {
              e.target.style.borderColor = '#f5f5dc';
              e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(245, 245, 220, 0.15)';
              e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.05)';
            }}
          />
        </div>
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.34rem',
          fontWeight: '600',
          fontSize: '0.75rem',
          color: '#f5f5dc'
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
            padding: '0.67rem',
            borderRadius: '8px',
            border: '2px solid rgba(245, 245, 220, 0.15)',
            fontSize: '0.75rem',
            backgroundColor: 'rgba(245, 245, 220, 0.05)',
            color: '#f5f5dc',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
            opacity: isLoading ? 0.7 : 1
          }}
          placeholder="email@exemplu.ro"
          onFocus={(e) => {
            e.target.style.borderColor = '#f5f5dc';
            e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(245, 245, 220, 0.15)';
            e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.05)';
          }}
        />
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.34rem',
          fontWeight: '600',
          fontSize: '0.75rem',
          color: '#f5f5dc'
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
            padding: '0.67rem',
            borderRadius: '8px',
            border: '2px solid rgba(245, 245, 220, 0.15)',
            fontSize: '0.75rem',
            backgroundColor: 'rgba(245, 245, 220, 0.05)',
            color: '#f5f5dc',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
            opacity: isLoading ? 0.7 : 1
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#f5f5dc';
            e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(245, 245, 220, 0.15)';
            e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.05)';
          }}
        >
          <option value="" style={{ backgroundColor: '#1f1f1f', color: '#f5f5dc' }}>Alege clasa</option>
          <option value="Clasa a 7-a" style={{ backgroundColor: '#1f1f1f', color: '#f5f5dc' }}>Clasa a 7-a</option>
          <option value="Clasa a 8-a" style={{ backgroundColor: '#1f1f1f', color: '#f5f5dc' }}>Clasa a 8-a</option>
        </select>
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.34rem',
          fontWeight: '600',
          fontSize: '0.75rem',
          color: '#f5f5dc'
        }}>
          Mesaj
        </label>
        <textarea
          value={contactForm.mesaj}
          onChange={(e) => setContactForm({...contactForm, mesaj: e.target.value})}
          disabled={isLoading}
          rows={3} 
          style={{
            width: '100%',
            padding: '0.67rem',
            borderRadius: '8px',
            border: '2px solid rgba(245, 245, 220, 0.15)',
            fontSize: '0.75rem',
            backgroundColor: 'rgba(245, 245, 220, 0.05)',
            color: '#f5f5dc',
            resize: 'vertical',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
            opacity: isLoading ? 0.7 : 1
          }}
          placeholder="Întrebări despre lecții? Trimiteți un mesaj..."
          onFocus={(e) => {
            e.target.style.borderColor = '#f5f5dc';
            e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(245, 245, 220, 0.15)';
            e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.05)';
          }}
        />
      </div>
      
      <button
        onClick={handleContactSubmit}
        disabled={isLoading}
        style={{
          background: isLoading ? 'rgba(156, 163, 175, 0.8)' : 'linear-gradient(135deg, #f5f5dc, #ffffff)', // Gradient bej-alb
          color: '#1f1f1f', // Text întunecat pe fundal deschis
          border: 'none',
          padding: '0.8rem 1.34rem', 
          borderRadius: '8px',
          fontSize: '0.74rem', 
          fontWeight: '600',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.34rem',
          marginTop: '0.67rem',
          boxShadow: isLoading ? 'none' : '0 5px 21px rgba(245, 245, 220, 0.3)',
          fontFamily: "'Poppins', sans-serif",
          opacity: isLoading ? 0.7 : 1
        }}
        onMouseOver={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 8px 27px rgba(245, 245, 220, 0.4)';
            e.target.style.background = 'linear-gradient(135deg, #ffffff, #f5f5dc)'; // Reverse gradient pe hover
          }
        }}
        onMouseOut={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 5px 21px rgba(245, 245, 220, 0.3)';
            e.target.style.background = 'linear-gradient(135deg, #f5f5dc, #ffffff)';
          }
        }}
      >
        <Send style={{ width: '0.67rem', height: '0.67rem', color: '#1f1f1f' }} />
        {isLoading ? 'Se trimite...' : 'Trimite mesajul'}
      </button>
    </div>
  </div>
</section>

      </div>
    </>
  );
};

export default HomePage;
