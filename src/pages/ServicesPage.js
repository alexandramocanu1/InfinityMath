import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, Check, ArrowLeft, ArrowRight, BookOpen, AlertCircle, Lock } from 'lucide-react';
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc, increment, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { registerUser, loginUser } from '../firebase/services';
import { db } from '../firebase/config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';

const ServicesPage = ({ selectedService, setSelectedService, setCurrentPage }) => {
  const { currentUser, userData, refreshUserData } = useAuth();
  const [step, setStep] = useState(selectedService ? 1 : 0);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Pentru popup-ul de autentificare
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    numeElev: '',
    prenumeElev: '',
    email: '',
    telefon: '',
    password: '',
    confirmPassword: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  const [adminSchedules, setAdminSchedules] = useState({
    evaluare: [],
    bac: []
  });

  // Verifică dacă s-a întors de la plată cu succes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const sessionId = urlParams.get('session_id');
    
    if (paymentSuccess === 'true' && sessionId && currentUser) {
      handlePaymentSuccess(sessionId);
    }
  }, [currentUser]);

  const handlePaymentSuccess = async (sessionId) => {
    try {
      setIsLoading(true);
      
      // Actualizează abonamentul utilizatorului în Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        'abonament.activ': true,
        'abonament.tip': selectedService,
        'abonament.dataInceperii': serverTimestamp(),
        'abonament.ziuaSaptamanii': selectedSchedule?.zi,
        'abonament.oraCurs': selectedSchedule?.ora,
        'abonament.linkCurs': null, // Va fi adăugat de admin
        'abonament.sessionId': sessionId,
        'abonament.dataUrmatoareiSedinte': null // Va fi calculată
      };
      
      await updateDoc(userRef, updateData);
      
      // Refresh user data pentru a reflecta schimbările
      await refreshUserData();
      
      // Arată mesajul de succes și redirecționează către profil
      setIsComplete(true);
      
      // După 3 secunde, redirecționează către profil
      setTimeout(() => {
        setCurrentPage('profile');
      }, 3000);
      
    } catch (error) {
      console.error('Eroare la activarea abonamentului:', error);
      alert('A apărut o eroare la activarea abonamentului. Te rog contactează suportul.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        const userDocData = {
          numeElev: user.displayName?.split(' ')[1] || 'Elev',
          prenumeElev: user.displayName?.split(' ')[0] || 'Nou',
          email: user.email,
          telefon: '',
          tipCont: user.email.includes('admin') ? 'admin' : 'elev',
          createdAt: serverTimestamp(),
          abonament: {
            activ: false,
            tip: 'evaluare',
            dataInceperii: null,
            linkCurs: null,
            ziuaSaptamanii: null,
            oraCurs: null,
            dataUrmatoareiSedinte: null
          }
        };

        await setDoc(doc(db, 'users', user.uid), userDocData);
      }

      setShowAuthModal(false);
      setStep(3);
      
    } catch (error) {
      console.error('Eroare la Google Login:', error);
      setAuthError('Eroare la autentificarea cu Google. Te rog să încerci din nou.');
    }
    
    setAuthLoading(false);
  };

  const services = {
    evaluare: { 
      name: 'Clasa a 7-a', 
      price: '60 RON / Sesiune',
      priceValue: 240, 
      duration: '1h 30 minute', 
      color: '#f59e0b'
    },
    bac: { 
      name: 'Clasa a 8-a', 
      price: '60 RON / Sesiune',
      priceValue: 240, 
      duration: '1h 30 minute', 
      color: '#ea580c'
    }
  };

  useEffect(() => {
    loadSchedulesFromFirebase();
  }, []);

  const loadSchedulesFromFirebase = async () => {
    try {
      const schedulesRef = collection(db, 'schedules');
      const querySnapshot = await getDocs(schedulesRef);
      
      const schedulesByType = {
        evaluare: [],
        bac: []
      };
      
      querySnapshot.forEach((doc) => {
        const scheduleData = { id: doc.id, ...doc.data() };
        
        if (schedulesByType[scheduleData.tip]) {
          schedulesByType[scheduleData.tip].push({
            id: scheduleData.id,
            zi: getZiTextRo(scheduleData.zi),
            ora: scheduleData.ora,
            tip: scheduleData.tip,
            enrolledCount: scheduleData.enrolledCount || 0
          });
        }
      });
      
      setAdminSchedules(schedulesByType);
    } catch (error) {
      console.error('Eroare la încărcarea programelor:', error);
    }
  };

  const getZiTextRo = (zi) => {
    const zileMap = {
      'luni': 'Luni',
      'marti': 'Marți', 
      'miercuri': 'Miercuri',
      'joi': 'Joi',
      'vineri': 'Vineri',
      'sambata': 'Sâmbătă',
      'duminica': 'Duminică'
    };
    return zileMap[zi] || zi;
  };

  const handleServiceSelect = (serviceId) => {
    if (services[serviceId].price === "-") return;
    setSelectedService(serviceId);
    setStep(1);
    setSelectedSchedule(null);
    setClientData({ name: '', email: '', phone: '', message: '' });
  };

  const goBackStep = () => {
    if (step === 1) {
      setStep(0);
      setSelectedService('');
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleContinue = () => {
    if (step === 1 && selectedSchedule) {
      if (currentUser && userData) {
        setStep(3);
      } else {
        setShowAuthModal(true);
      }
    } else if (step === 2 && clientData.name && clientData.email && clientData.phone) {
      setStep(3);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const result = await loginUser(loginForm.email, loginForm.password);
    
    if (result.success) {
      setLoginForm({ email: '', password: '' });
      setShowAuthModal(false);
      setStep(3);
    } else {
      setAuthError(result.error);
    }
    
    setAuthLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError('Parolele nu coincid');
      setAuthLoading(false);
      return;
    }

    const result = await registerUser(registerForm);
    
    if (result.success) {
      setRegisterForm({
        numeElev: '',
        prenumeElev: '',
        email: '',
        telefon: '',
        password: '',
        confirmPassword: ''
      });
      setShowAuthModal(false);
      setStep(3);
    } else {
      setAuthError(result.error);
    }
    
    setAuthLoading(false);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthError('');
    setLoginForm({ email: '', password: '' });
    setRegisterForm({
      numeElev: '',
      prenumeElev: '',
      email: '',
      telefon: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    
    try {
      if (currentUser && userData) {
        const currentService = services[selectedService];
        
        // Salvează informațiile despre programare ÎNAINTE de plată
        const enrollmentData = {
          userId: currentUser.uid,
          scheduleId: selectedSchedule.id,
          serviceTip: selectedService,
          clientName: `${userData.prenumeElev} ${userData.numeElev}`,
          clientEmail: userData.email,
          clientPhone: userData.telefon,
          scheduleDay: selectedSchedule.zi,
          scheduleTime: selectedSchedule.ora,
          serviceName: currentService.name,
          servicePrice: currentService.priceValue,
          createdAt: serverTimestamp(),
          status: 'pending_payment'
        };
        
        // Salvează înscrierea în baza de date
        const enrollmentRef = await addDoc(collection(db, 'enrollments'), enrollmentData);
        
        // Salvează ID-ul înscrierii în sessionStorage pentru recuperare după plată
        sessionStorage.setItem('pendingEnrollment', JSON.stringify({
          enrollmentId: enrollmentRef.id,
          selectedService,
          selectedSchedule,
          userId: currentUser.uid
        }));
        
        // Redirect către Stripe cu parametri pentru success URL
        const successUrl = `${window.location.origin}/services?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${window.location.origin}/services`;
        
        // Construiește URL-ul Stripe cu parametrii
        const stripeUrl = `https://buy.stripe.com/cNi14na6ccbP4Yp6Ap5AQ02?success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
        
        window.location.href = stripeUrl;
        
      } else {
        // Pentru utilizatori neautentificați
        const currentService = services[selectedService];
        
        const enrollmentData = {
          scheduleId: selectedSchedule.id,
          serviceTip: selectedService,
          clientName: clientData.name,
          clientEmail: clientData.email,
          clientPhone: clientData.phone,
          clientMessage: clientData.message,
          scheduleDay: selectedSchedule.zi,
          scheduleTime: selectedSchedule.ora,
          serviceName: currentService.name,
          servicePrice: currentService.priceValue,
          createdAt: serverTimestamp(),
          status: 'pending'
        };
        
        await addDoc(collection(db, 'enrollments'), enrollmentData);
        setIsComplete(true);
      }
      
    } catch (error) {
      console.error('Eroare la salvarea programării:', error);
      alert('A apărut o eroare la salvarea programării. Te rog să încerci din nou.');
    }
    
    setIsLoading(false);
  };

  const resetBooking = () => {
    setStep(0);
    setSelectedService('');
    setSelectedSchedule(null);
    setClientData({ name: '', email: '', phone: '', message: '' });
    setIsComplete(false);
    setCurrentPage('home');
  };

  const currentService = selectedService ? services[selectedService] : null;
  const availableSchedules = selectedService ? adminSchedules[selectedService] || [] : [];

  return (
    <>
      <div style={{ 
        fontFamily: "'Poppins', sans-serif", 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcd3c 100%)',
        padding: 'clamp(1rem, 3vw, 2rem) 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: 'clamp(150px, 20vw, 200px)',
        height: 'clamp(150px, 20vw, 200px)',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: 'clamp(200px, 25vw, 300px)',
        height: 'clamp(200px, 25vw, 300px)',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 1
      }}></div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(2rem, 5vw, 3rem)'
        }}>
          <button
            onClick={() => setCurrentPage('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#000000',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '2rem',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              transition: 'all 0.3s ease',
              padding: 'clamp(0.4rem, 1vw, 0.5rem) clamp(0.8rem, 2vw, 1rem)',
              borderRadius: '8px',
              backdropFilter: 'blur(5px)',
              margin: '0 auto 2rem auto'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            Înapoi la Pagina Principală
          </button>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '800',
            color: '#000000',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '-0.02em'
          }}>
            {step === 0 ? 'Alege Serviciul' : `Programare: ${currentService?.name}`}
          </h1>
          
          {/* Progress Steps */}
          {step > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'clamp(0.5rem, 2vw, 1rem)',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div style={{
                    width: 'clamp(30px, 6vw, 40px)',
                    height: 'clamp(30px, 6vw, 40px)',
                    borderRadius: '50%',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    backgroundColor: step >= stepNum ? (currentService?.color || '#ea580c') : '#e5e7eb'
                  }}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div style={{
                      width: 'clamp(30px, 8vw, 60px)',
                      height: '2px',
                      backgroundColor: step > stepNum ? (currentService?.color || '#ea580c') : '#e5e7eb'
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
          
          <div style={{
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            color: '#000000',
            marginBottom: '1rem',
            fontWeight: '500',
            opacity: '0.8'
          }}>
            {step === 1 && 'Selectează programul săptămânal'}
            {step === 2 && 'Completează datele de contact'}
            {step === 3 && 'Confirmă programarea'}
          </div>
        </div>

        {/* Content Card */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          margin: '0 auto',
          maxWidth: '1000px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          
          {/* Step 0: Service Selection */}
          {step === 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(1rem, 3vw, 2rem)',
              flexWrap: 'wrap'
            }}>
              {Object.entries(services).map(([serviceId, service]) => (
                <div 
                  key={serviceId} 
                  onClick={() => handleServiceSelect(serviceId)}
                  style={{
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    borderRadius: '16px',
                    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: 'clamp(280px, 45vw, 350px)',
                    backdropFilter: 'blur(5px)',
                    border: selectedService === serviceId ? `3px solid ${service.color}` : '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.borderColor = service.color;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.8)';
                    if (selectedService !== serviceId) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }
                  }}
                >
                  <div style={{
                    width: 'clamp(60px, 12vw, 80px)',
                    height: 'clamp(60px, 12vw, 80px)',
                    margin: '0 auto 1.5rem'
                  }}>
                    <img 
                      src={serviceId === 'evaluare' ? '/images/logo_VII_2.png' : '/images/logo_VIII_2.png'}
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
                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                    fontWeight: '600',
                    color: '#2d3748',
                    marginBottom: '0.5rem'
                  }}>
                    {service.name}
                  </h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
                      fontWeight: '700',
                      color: service.color,
                      marginBottom: '0.5rem'
                    }}>
                      60 RON / ședință
                    </div>
                    
                    <div style={{
                      fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
                      fontWeight: '600',
                      color: '#718096',
                      marginBottom: '0.2rem'
                    }}>
                      Abonament lunar la 240 RON
                    </div>
                    
                    <div style={{
                      fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                      color: '#718096'
                    }}>
                      {service.duration} / ședință
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceSelect(serviceId);
                    }}
                    style={{
                      backgroundColor: service.color,
                      color: 'white',
                      border: 'none',
                      padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: '100%'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = '0.9';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Selectează
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Schedule Selection */}
          {step === 1 && (
            <div>
              <h3 style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                marginBottom: '1.5rem',
                color: '#1f2937',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Programare - {currentService?.name}
              </h3>
              
              <div style={{
                backgroundColor: 'rgba(240, 249, 255, 0.9)',
                border: `1px solid ${currentService?.color}60`,
                borderRadius: '12px',
                padding: 'clamp(1rem, 2.5vw, 1.2rem)',
                marginBottom: '2rem',
                textAlign: 'center',
                backdropFilter: 'blur(5px)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <Calendar style={{ width: '1rem', height: '1rem', color: currentService?.color }} />
                  <span style={{ fontWeight: '600', color: currentService?.color }}>Program Săptămânal</span>
                </div>
                <p style={{
                  margin: '0',
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                  color: '#475569'
                }}>
                  Aceste ore se repetă în fiecare săptămână. Odată înscris, vei participa la aceeași oră în fiecare săptămână.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'clamp(1rem, 3vw, 1.5rem)'
              }}>
                {availableSchedules.map((schedule) => (
                  <div 
                    key={schedule.id}
                    onClick={() => setSelectedSchedule(schedule)}
                    style={{
                      borderRadius: '12px',
                      padding: 'clamp(1rem, 3vw, 1.5rem)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(5px)',
                      backgroundColor: selectedSchedule?.id === schedule.id ? '#f0f9ff' : '#f8fafc',
                      border: selectedSchedule?.id === schedule.id ? 
                             `2px solid ${currentService?.color}` : '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      if (selectedSchedule?.id !== schedule.id) {
                        e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.9)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.borderColor = `${currentService?.color}80`;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedSchedule?.id !== schedule.id) {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
                        fontWeight: '600',
                        color: currentService?.color
                      }}>
                        {schedule.zi}
                      </div>
                      <div style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '12px',
                        fontSize: 'clamp(0.7rem, 1.6vw, 0.8rem)',
                        fontWeight: '600',
                        backgroundColor: selectedSchedule?.id === schedule.id ? currentService?.color : '#e5e7eb',
                        color: selectedSchedule?.id === schedule.id ? 'white' : '#6b7280'
                      }}>
                        {selectedSchedule?.id === schedule.id ? 'SELECTAT' : 'DISPONIBIL'}
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <Clock style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      <span style={{
                        fontSize: 'clamp(1rem, 2.4vw, 1.1rem)',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {schedule.ora}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {availableSchedules.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: 'clamp(2rem, 5vw, 3rem)',
                  color: '#6b7280'
                }}>
                  <AlertCircle style={{
                    width: 'clamp(2.5rem, 6vw, 3rem)',
                    height: 'clamp(2.5rem, 6vw, 3rem)',
                    margin: '0 auto 1rem',
                    color: '#d1d5db'
                  }} />
                  <h4 style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.2rem)',
                    marginBottom: '0.5rem',
                    color: '#1f2937'
                  }}>
                    Nu sunt programe disponibile
                  </h4>
                  <p style={{ margin: '0' }}>
                    Administratorul nu a configurat încă programele pentru acest serviciu.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div>
              <h3 style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                marginBottom: '1.5rem',
                color: '#1f2937',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Datele Tale de Contact
              </h3>
              
              {/* Selection Summary */}
              <div style={{
                backgroundColor: 'rgba(240, 249, 255, 0.9)',
                border: `2px solid ${currentService?.color}`,
                borderRadius: '12px',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                marginBottom: '2rem',
                backdropFilter: 'blur(5px)'
              }}>
                <h4 style={{
                  margin: '0 0 1rem 0',
                  fontSize: 'clamp(1rem, 2.4vw, 1.1rem)',
                  fontWeight: '600',
                  color: currentService?.color
                }}>
                  Programare Selectată
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Serviciu:</span>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{currentService?.name}</div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Program:</span>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {selectedSchedule?.zi} la {selectedSchedule?.ora}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Preț:</span>
                    <div style={{
                      fontWeight: '600',
                      fontSize: 'clamp(1rem, 2.4vw, 1.1rem)',
                      color: currentService?.color
                    }}>
                      240 RON/lună
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div style={{
                display: 'grid',
                gap: 'clamp(1rem, 3vw, 1.5rem)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontWeight: '500',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                    }}>
                      Nume Complet *
                    </label>
                    <input
                      type="text"
                      value={clientData.name}
                      onChange={(e) => setClientData({...clientData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.7rem, 2vw, 0.8rem)',
                        border: '1px solid rgba(209, 213, 219, 0.5)',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: '#1f2937',
                        backdropFilter: 'blur(5px)'
                      }}
                      placeholder="Introdu numele complet"
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontWeight: '500',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={clientData.email}
                      onChange={(e) => setClientData({...clientData, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.7rem, 2vw, 0.8rem)',
                        border: '1px solid rgba(209, 213, 219, 0.5)',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: '#1f2937',
                        backdropFilter: 'blur(5px)'
                      }}
                      placeholder="email@exemplu.ro"
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#374151',
                    fontWeight: '500',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Număr de Telefon *
                  </label>
                  <input
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.7rem, 2vw, 0.8rem)',
                      border: '1px solid rgba(209, 213, 219, 0.5)',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      color: '#1f2937',
                      backdropFilter: 'blur(5px)'
                    }}
                    placeholder="+40 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#374151',
                    fontWeight: '500',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Mesaj (opțional)
                  </label>
                  <textarea
                    value={clientData.message}
                    onChange={(e) => setClientData({...clientData, message: e.target.value})}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.7rem, 2vw, 0.8rem)',
                      border: '1px solid rgba(209, 213, 219, 0.5)',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      color: '#1f2937',
                      backdropFilter: 'blur(5px)'
                    }}
                    placeholder="Detalii suplimentare sau întrebări..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Final Confirmation */}
          {step === 3 && (
            <div>
              <h3 style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                marginBottom: '1.5rem',
                color: '#1f2937',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Confirmă Programarea
              </h3>
              
              {/* Final Summary */}
              <div style={{
                backgroundColor: 'rgba(240, 249, 255, 0.9)',
                border: `2px solid ${currentService?.color}`,
                borderRadius: '12px',
                padding: 'clamp(1rem, 3vw, 2rem)',
                marginBottom: 'clamp(1rem, 3vw, 2rem)',
                backdropFilter: 'blur(5px)'
              }}>
                <h4 style={{
                  margin: '0 0 clamp(1rem, 2.5vw, 1.5rem) 0',
                  fontSize: 'clamp(1rem, 2.4vw, 1.2rem)',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: currentService?.color
                }}>
                  Sumar Programare
                </h4>
                
                <div style={{
                  display: 'grid',
                  gap: 'clamp(0.75rem, 2vw, 1rem)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    flexDirection: window.innerWidth < 400 ? 'column' : 'row'
                  }}>
                    <span style={{ 
                      color: '#6b7280',
                      fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                      minWidth: 'fit-content'
                    }}>
                      Serviciu:
                    </span>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#1f2937',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      textAlign: window.innerWidth < 400 ? 'left' : 'right'
                    }}>
                      {currentService?.name}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    flexDirection: window.innerWidth < 400 ? 'column' : 'row'
                  }}>
                    <span style={{ 
                      color: '#6b7280',
                      fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                      minWidth: 'fit-content'
                    }}>
                      Program săptămânal:
                    </span>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#1f2937',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      textAlign: window.innerWidth < 400 ? 'left' : 'right'
                    }}>
                      {selectedSchedule?.zi} la {selectedSchedule?.ora}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    flexDirection: window.innerWidth < 400 ? 'column' : 'row'
                  }}>
                    <span style={{ 
                      color: '#6b7280',
                      fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                      minWidth: 'fit-content'
                    }}>
                      Client:
                    </span>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#1f2937',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      textAlign: window.innerWidth < 400 ? 'left' : 'right',
                      wordBreak: 'break-word'
                    }}>
                      {currentUser && userData 
                        ? `${userData.prenumeElev} ${userData.numeElev}`
                        : clientData.name
                      }
                    </span>
                  </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      flexDirection: window.innerWidth < 400 ? 'column' : 'row'
                    }}>
                      <span style={{ 
                        color: '#6b7280',
                        fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                        minWidth: 'fit-content'
                      }}>
                        Email:
                      </span>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#1f2937',
                        fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                        textAlign: window.innerWidth < 400 ? 'left' : 'right',
                        wordBreak: 'break-all'
                      }}>
                        {currentUser && userData ? userData.email : clientData.email}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      flexDirection: window.innerWidth < 400 ? 'column' : 'row'
                    }}>
                      <span style={{ 
                        color: '#6b7280',
                        fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                        minWidth: 'fit-content'
                      }}>
                        Telefon:
                      </span>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#1f2937',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        textAlign: window.innerWidth < 400 ? 'left' : 'right'
                      }}>
                        {currentUser && userData ? userData.telefon : clientData.phone}
                      </span>
                    </div>
                    
                    {clientData.message && (
                      <div style={{
                        display: 'grid',
                        gap: '0.5rem'
                      }}>
                        <span style={{ 
                          color: '#6b7280',
                          fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)'
                        }}>
                          Mesaj:
                        </span>
                        <div style={{
                          fontWeight: '600',
                          color: '#1f2937',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          padding: '0.5rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: '6px',
                          wordBreak: 'break-word'
                        }}>
                          {clientData.message}
                        </div>
                      </div>
                    )}
                    
                    <hr style={{
                      border: 'none',
                      borderTop: '1px solid rgba(229, 231, 235, 0.5)',
                      margin: 'clamp(0.75rem, 2vw, 1rem) 0'
                    }} />
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      flexDirection: window.innerWidth < 400 ? 'column' : 'row'
                    }}>
                      <span style={{
                        fontSize: 'clamp(1rem, 2.4vw, 1.1rem)',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        Total lunar:
                      </span>
                      <span style={{
                        fontSize: 'clamp(1.3rem, 3vw, 1.5rem)',
                        fontWeight: '700',
                        color: currentService?.color
                      }}>
                        {currentService?.priceValue} RON
                      </span>
                    </div>
                    
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      padding: 'clamp(0.75rem, 2vw, 1rem)',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                      textAlign: 'center',
                      border: `1px solid ${currentService?.color}40`,
                      color: currentService?.color,
                      backdropFilter: 'blur(5px)',
                      lineHeight: '1.4'
                    }}>
                      📚 {currentUser && userData 
                        ? 'Înscrierea va fi confirmată instantaneu!' 
                        : 'Programare confirmată pentru cursurile săptămânale'
                      }
                    </div>
                  </div>
                </div>

                {/* Status pentru utilizatori autentificați vs neautentificați */}
                <div style={{
                  backgroundColor: 'rgba(249, 250, 251, 0.9)',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  borderRadius: '8px',
                  marginBottom: 'clamp(1rem, 3vw, 2rem)',
                  fontSize: 'clamp(0.75rem, 1.6vw, 0.8rem)',
                  color: '#6b7280',
                  lineHeight: '1.5',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  backdropFilter: 'blur(5px)'
                }}>
                  {currentUser && userData ? (
                    <>
                      ✅ <strong style={{ color: '#10b981' }}>Înscrierea instantanee</strong><br/>
                      • Contul tău este verificat - înscrierea se face automat<br/>
                      • Vei vedea cursul în pagina ta de profil imediat după plată<br/>
                      • Link-ul cursului va apărea când profesorul îl va adăuga<br/>
                      • Poți gestiona înscrierea din pagina de profil
                    </>
                  ) : (
                    <>
                      📞 <strong style={{ color: '#10b981' }}>Sesiune programată cu succes!</strong><br/>
                      • Poți vedea programarile tale din pagina de profil
                    </>
                  )}
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    border: 'none',
                    padding: 'clamp(1rem, 2.5vw, 1.2rem) clamp(1.5rem, 4vw, 2rem)',
                    borderRadius: '8px',
                    fontSize: 'clamp(1rem, 2.4vw, 1.1rem)',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                    backgroundColor: isLoading ? '#9ca3af' : currentService?.color,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading && currentService?.color) {
                      const colors = {
                        '#f59e0b': '#d97706',
                        '#ea580c': '#c2410c',
                        '#dc2626': '#b91c1c'
                      };
                      e.target.style.backgroundColor = colors[currentService.color] || currentService.color;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = currentService?.color;
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      {currentUser && userData ? 'Se înscrie...' : 'Se salvează programarea...'}
                    </>
                  ) : (
                    <>
                      <Check style={{ width: '1rem', height: '1rem' }} />
                      {currentUser && userData ? 'Către plată' : 'Confirmă Programarea'}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            {step > 0 && step < 3 && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem',
                justifyContent: step === 0 ? 'center' : 'space-between',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={goBackStep}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(243, 244, 246, 0.8)',
                    color: '#374151',
                    border: 'none',
                    padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(5px)',
                    opacity: isLoading ? 0.5 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = 'rgba(229, 231, 235, 0.9)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = 'rgba(243, 244, 246, 0.8)';
                    }
                  }}
                >
                  <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                  Înapoi
                </button>
                
                <button
                  onClick={handleContinue}
                  disabled={
                    (step === 1 && !selectedSchedule) ||
                    (step === 2 && (!clientData.name || !clientData.email || !clientData.phone))
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    border: 'none',
                    padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    backgroundColor: currentService?.color || '#ea580c',
                    opacity: (step === 1 && !selectedSchedule) || 
                             (step === 2 && (!clientData.name || !clientData.email || !clientData.phone)) ? 0.5 : 1
                  }}
                >
                  Continuă
                  <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)',
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              padding: 'clamp(1.5rem, 4vw, 2rem)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
              backdropFilter: 'blur(20px)'
            }}>
              <button
                onClick={closeAuthModal}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Lock style={{ 
                  width: 'clamp(2.5rem, 6vw, 3rem)', 
                  height: 'clamp(2.5rem, 6vw, 3rem)', 
                  color: currentService?.color || '#ea580c',
                  marginBottom: '1rem' 
                }} />
                <h2 style={{ 
                  fontSize: 'clamp(1.3rem, 3vw, 1.5rem)', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  marginBottom: '0.5rem' 
                }}>
                  Cont Necesar
                </h2>
                <p style={{ 
                  color: '#6b7280',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}>
                  Pentru a continua cu programarea, ai nevoie de un cont.
                </p>
              </div>

              {authError && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: 'clamp(0.8rem, 1.8vw, 0.875rem)'
                }}>
                  {authError}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', marginBottom: '1rem' }}>
                  <button
                    onClick={() => setShowRegister(false)}
                    style={{
                      flex: 1,
                      padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                      backgroundColor: !showRegister ? (currentService?.color || '#ea580c') : 'transparent',
                      color: !showRegister ? 'white' : '#6b7280',
                      border: `2px solid ${currentService?.color || '#ea580c'}`,
                      borderRadius: '8px 0 0 8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: 'clamp(0.85rem, 1.8vw, 0.9rem)'
                    }}
                  >
                    Logare
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    style={{
                      flex: 1,
                      padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                      backgroundColor: showRegister ? (currentService?.color || '#ea580c') : 'transparent',
                      color: showRegister ? 'white' : '#6b7280',
                      border: `2px solid ${currentService?.color || '#ea580c'}`,
                      borderRadius: '0 8px 8px 0',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: 'clamp(0.85rem, 1.8vw, 0.9rem)'
                    }}
                  >
                    Cont Nou
                  </button>
                </div>
              </div>

              {!showRegister ? (
                // Formular Login
                <>
                  <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        textAlign: 'left'
                      }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        required
                        disabled={authLoading}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          boxSizing: 'border-box'
                        }}
                        placeholder="email@exemplu.ro"
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        textAlign: 'left'
                      }}>
                        Parolă
                      </label>
                      <input
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
                        disabled={authLoading}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          boxSizing: 'border-box'
                        }}
                        placeholder="Parola ta"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                        backgroundColor: currentService?.color || '#ea580c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        fontWeight: '600',
                        cursor: authLoading ? 'not-allowed' : 'pointer',
                        opacity: authLoading ? 0.7 : 1
                      }}
                    >
                      {authLoading ? 'Se conectează...' : 'Conectează-te'}
                    </button>
                  </form>

                  {/* Google Login Button */}
                  <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      margin: '1rem 0', 
                      color: '#6b7280' 
                    }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                      <span style={{ margin: '0 1rem', fontSize: 'clamp(0.8rem, 1.8vw, 0.875rem)' }}>sau</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    </div>
                    
                    <button
                      onClick={handleGoogleLogin}
                      disabled={authLoading}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        fontWeight: '500',
                        cursor: authLoading ? 'not-allowed' : 'pointer',
                        opacity: authLoading ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        if (!authLoading) {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.borderColor = '#d1d5db';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!authLoading) {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.borderColor = '#e5e7eb';
                        }
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {authLoading ? 'Se conectează...' : 'Continuă cu Google'}
                    </button>
                  </div>
                </>
              ) : (
                // Formular Register
                <>
                  <form onSubmit={handleRegister}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: window.innerWidth < 600 ? '1fr' : '1fr 1fr', 
                      gap: '1rem', 
                      marginBottom: '1rem' 
                    }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem', 
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          textAlign: 'left'
                        }}>
                          Nume
                        </label>
                        <input
                          type="text"
                          value={registerForm.numeElev}
                          onChange={(e) => setRegisterForm({...registerForm, numeElev: e.target.value})}
                          required
                          disabled={authLoading}
                          style={{
                            width: '100%',
                            padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            boxSizing: 'border-box'
                          }}
                          placeholder="Nume"
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem', 
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          textAlign: 'left'
                        }}>
                          Prenume
                        </label>
                        <input
                          type="text"
                          value={registerForm.prenumeElev}
                          onChange={(e) => setRegisterForm({...registerForm, prenumeElev: e.target.value})}
                          required
                          disabled={authLoading}
                          style={{
                            width: '100%',
                            padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            boxSizing: 'border-box'
                          }}
                          placeholder="Prenume"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        textAlign: 'left'
                      }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                        required
                        disabled={authLoading}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          boxSizing: 'border-box'
                        }}
                        placeholder="email@exemplu.ro"
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        textAlign: 'left'
                      }}>
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={registerForm.telefon}
                        onChange={(e) => setRegisterForm({...registerForm, telefon: e.target.value})}
                        required
                        disabled={authLoading}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          boxSizing: 'border-box'
                        }}
                        placeholder="+40 XXX XXX XXX"
                      />
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: window.innerWidth < 600 ? '1fr' : '1fr 1fr', 
                      gap: '1rem', 
                      marginBottom: '1.5rem' 
                    }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem', 
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          textAlign: 'left'
                        }}>
                          Parolă
                        </label>
                        <input
                          type="password"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                          required
                          disabled={authLoading}
                          style={{
                            width: '100%',
                            padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            boxSizing: 'border-box'
                          }}
                          placeholder="Parolă"
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem', 
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          textAlign: 'left'
                        }}>
                          Confirmă Parola
                        </label>
                        <input
                          type="password"
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                          required
                          disabled={authLoading}
                          style={{
                            width: '100%',
                            padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            boxSizing: 'border-box'
                          }}
                          placeholder="Confirmă parola"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                        backgroundColor: currentService?.color || '#ea580c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        fontWeight: '600',
                        cursor: authLoading ? 'not-allowed' : 'pointer',
                        opacity: authLoading ? 0.7 : 1
                      }}
                    >
                      {authLoading ? 'Se creează contul...' : 'Creează Cont'}
                    </button>
                  </form>

                  {/* Google Login Button pentru Register */}
                  <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      margin: '1rem 0', 
                      color: '#6b7280' 
                    }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                      <span style={{ margin: '0 1rem', fontSize: 'clamp(0.8rem, 1.8vw, 0.875rem)' }}>sau</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    </div>
                    
                    <button
                      onClick={handleGoogleLogin}
                      disabled={authLoading}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        fontWeight: '500',
                        cursor: authLoading ? 'not-allowed' : 'pointer',
                        opacity: authLoading ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        if (!authLoading) {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.borderColor = '#d1d5db';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!authLoading) {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.borderColor = '#e5e7eb';
                        }
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {authLoading ? 'Se conectează...' : 'Continuă cu Google'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Success Modal */}
        {isComplete && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)',
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              padding: 'clamp(2rem, 5vw, 3rem)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{
                width: 'clamp(60px, 15vw, 80px)',
                height: 'clamp(60px, 15vw, 80px)',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                <Check style={{ 
                  width: 'clamp(1.5rem, 4vw, 2.5rem)', 
                  height: 'clamp(1.5rem, 4vw, 2.5rem)', 
                  color: 'white' 
                }} />
              </div>
              
              <h2 style={{
                fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                {currentUser && userData ? 'Abonament Activat!' : 'Programare Confirmată!'}
              </h2>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem',
                lineHeight: '1.6',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                {currentUser && userData ? (
                  <>
                    Felicitări! Abonamentul tău pentru <strong style={{ color: currentService?.color }}>{currentService?.name}</strong> a fost activat cu succes.
                    <br/>
                    Program: <strong style={{ color: '#1f2937' }}>{selectedSchedule?.zi} la {selectedSchedule?.ora}</strong>
                    <br/><br/>
                    Poți vedea cursul în pagina ta de profil. Te vei întorce acolo în câteva secunde!
                  </>
                ) : (
                  <>
                    Programarea ta pentru <strong style={{ color: currentService?.color }}>{currentService?.name}</strong> a fost înregistrată cu succes.
                    <br/>
                    Program: <strong style={{ color: '#1f2937' }}>{selectedSchedule?.zi} la {selectedSchedule?.ora}</strong>
                    <br/><br/>
                    Vei fi contactat în următoarele 24 de ore pentru confirmarea finală și detaliile sesiunii!
                  </>
                )}
              </p>
              
              <button
                onClick={resetBooking}
                style={{
                  background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                  color: 'white',
                  border: 'none',
                  padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #e55a2b, #e6851a)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #ff6b35, #f7931e)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(255, 107, 53, 0.3)';
                }}
              >
                {currentUser && userData ? 'Înapoi la Profil' : 'Înapoi la Pagina Principală'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input::placeholder,
          textarea::placeholder {
            color: #9ca3af;
            opacity: 1;
          }
          
          input:focus,
          textarea:focus,
          select:focus {
            outline: none;
            border-color: ${currentService?.color || '#f59e0b'};
            box-shadow: 0 0 0 2px ${currentService?.color || '#f59e0b'}20;
          }

          /* Mobile optimizations */
          @media (max-width: 768px) {
            .services-grid {
              grid-template-columns: 1fr !important;
            }
            
            .form-row {
              grid-template-columns: 1fr !important;
            }
            
            .progress-container {
              flex-wrap: wrap !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default ServicesPage;