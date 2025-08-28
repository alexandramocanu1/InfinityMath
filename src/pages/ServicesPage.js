import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, Check, ArrowLeft, ArrowRight, BookOpen, AlertCircle, Lock } from 'lucide-react';
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc, increment, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { registerUser, loginUser } from '../firebase/services';
import { db } from '../firebase/config';
import { servicesPageStyles } from './ServicesPageStyles';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';
import { CreditCard, Shield } from 'lucide-react';
import NTPLogo from 'ntp-logo-react';
import { getFunctions, httpsCallable } from 'firebase/functions';

const ServicesPage = ({ selectedService, setSelectedService, setCurrentPage }) => {
  const { currentUser, userData } = useAuth();
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

  // Pentru Netopia
const [showPayment, setShowPayment] = useState(false);
const [paymentData, setPaymentData] = useState(null);
const [paymentLoading, setPaymentLoading] = useState(false);


const handleGoogleLogin = async () => {
  setAuthLoading(true);
  setAuthError('');

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Verifică dacă utilizatorul are deja un document în Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Creează documentul pentru utilizatorul nou
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
      console.log('✅ Document creat pentru Google user:', user.uid);
    }

    // Închide modal-ul și continuă la pasul final
    setShowAuthModal(false);
    setStep(3);
    
  } catch (error) {
    console.error('❌ Eroare la Google Login:', error);
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
        
        // Grupăm după tip (evaluare = clasa a 7-a, bac = clasa a 8-a)
        if (schedulesByType[scheduleData.tip]) {
          schedulesByType[scheduleData.tip].push({
            id: scheduleData.id,
            zi: getZiTextRo(scheduleData.zi), // Convertim la format afișabil
            ora: scheduleData.ora,
            tip: scheduleData.tip,
            enrolledCount: scheduleData.enrolledCount || 0
          });
        }
      });
      
      setAdminSchedules(schedulesByType);
      console.log('Schedules loaded:', schedulesByType);
    } catch (error) {
      console.error('Eroare la încărcarea programelor:', error);
    }
  };

  // Convertește numele zilei din baza de date la format afișabil
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
      // Verifică dacă utilizatorul este autentificat
      if (currentUser && userData) {
        // Utilizator autentificat - sare direct la confirmarea finală
        setStep(3);
      } else {
        // Utilizator neautentificat - arată popup-ul de login/register
        setShowAuthModal(true);
      }
    } else if (step === 2 && clientData.name && clientData.email && clientData.phone) {
      setStep(3);
    }
  };

  // Funcții pentru autentificare în popup
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const result = await loginUser(loginForm.email, loginForm.password);
    
    if (result.success) {
      setLoginForm({ email: '', password: '' });
      setShowAuthModal(false);
      // Utilizatorul s-a autentificat cu succes, mergem la pasul final
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
      // Utilizatorul s-a înregistrat cu succes, mergem la pasul final
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

  const generatePaymentData = () => {
  const currentService = services[selectedService];
  const orderAmount = currentService.priceValue;
  
  const orderId = `INF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const paymentData = {
    orderId: orderId,
    amount: orderAmount,
    currency: 'RON',
    description: `${currentService.name} - ${selectedSchedule.zi} ${selectedSchedule.ora}`,
    
    customerInfo: {
      email: currentUser && userData ? userData.email : clientData.email,
      phone: currentUser && userData ? userData.telefon : clientData.phone,
      firstName: currentUser && userData ? userData.prenumeElev : clientData.name.split(' ')[0],
      lastName: currentUser && userData ? userData.numeElev : clientData.name.split(' ').slice(1).join(' ')
    },
    
    returnUrls: {
      success: `${window.location.origin}/payment-success`,
      cancel: `${window.location.origin}/payment-cancel`,
      error: `${window.location.origin}/payment-error`
    },
    
    metadata: {
      scheduleId: selectedSchedule.id,
      serviceTip: selectedService,
      userId: currentUser?.uid || null
    }
  };

  return paymentData;
};

const handlePaymentSuccess = async (paymentResult) => {
  try {
    if (paymentData?.enrollmentId) {
      const enrollmentRef = doc(db, 'enrollments', paymentData.enrollmentId);
      await updateDoc(enrollmentRef, {
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: paymentResult.ntpID,
        paymentDate: serverTimestamp()
      });
      
      const scheduleRef = doc(db, 'schedules', selectedSchedule.id);
      await updateDoc(scheduleRef, {
        enrolledCount: increment(1)
      });
      
      console.log('Payment successful, enrollment confirmed');
    }
    
    setShowPayment(false);
    setIsComplete(true);
    
  } catch (error) {
    console.error('Eroare la confirmarea plății:', error);
    alert('Plata a fost procesată, dar a apărut o eroare la confirmarea înscrierii. Te rugăm să ne contactezi.');
  }
};

const handlePaymentCancel = () => {
  setShowPayment(false);
  alert('Plata a fost anulată. Înscrierea nu a fost finalizată.');
};



const handleFinalSubmit = async () => {
  setIsLoading(true);
  
  try {
    if (currentUser && userData) {
      const currentService = services[selectedService];
      
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
        servicePrice: currentService.price,
        createdAt: serverTimestamp(),
        status: 'pending_payment'
      };
      
      const enrollmentRef = await addDoc(collection(db, 'enrollments'), enrollmentData);
      
      // Creează datele pentru plată
      const paymentInfo = {
        orderId: `INF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: currentService.priceValue,
        currency: 'RON',
        description: `${currentService.name} - ${selectedSchedule.zi} ${selectedSchedule.ora}`,
        customerInfo: {
          email: userData.email,
          phone: userData.telefon,
          firstName: userData.prenumeElev,
          lastName: userData.numeElev
        },
        metadata: {
          scheduleId: selectedSchedule.id,
          serviceTip: selectedService,
          enrollmentId: enrollmentRef.id,
          scheduleDay: selectedSchedule.zi,
          scheduleTime: selectedSchedule.ora
        }
      };
      
      console.log('Calling createPayment with data:', paymentInfo);
      
      // Apelează funcția Firebase
      const functions = getFunctions();
      const createPayment = httpsCallable(functions, "createPayment");
      const result = await createPayment(paymentInfo);

      console.log('createPayment result:', result);

      // Verifică rezultatul și redirecționează
      if (result.data && result.data.success && result.data.paymentUrl) {
        console.log('Redirecting to Netopia payment:', result.data.paymentUrl);
        // Redirect direct către URL-ul returnat de Netopia
        window.location.href = result.data.paymentUrl;
      } else {
        throw new Error(result.data?.message || "Eroare la generarea plății - răspuns invalid de la server");
      }
      
    } else {
      // Pentru utilizatori neautentificați - doar salvează programarea
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
        servicePrice: currentService.price,
        createdAt: serverTimestamp(),
        status: 'pending'
      };
      
      await addDoc(collection(db, 'enrollments'), enrollmentData);
      setIsComplete(true);
      console.log('Guest enrollment saved:', enrollmentData);
    }
    
  } catch (error) {
    console.error('Eroare detaliată la salvarea programării:', error);
    
    // Afișează detalii mai clare despre eroare
    let errorMessage = "Eroare la salvarea programării.";
    
    if (error.code) {
      errorMessage = `Eroare Firebase: ${error.code} - ${error.message}`;
    } else if (error.message) {
      errorMessage = `Eroare: ${error.message}`;
    }
    
    // Afișează și detalii din răspunsul serverului dacă există
    if (error.details) {
      errorMessage += `\nDetalii: ${error.details}`;
    }
    
    alert(errorMessage);
    console.error('Error object:', error);
  }
  
  setIsLoading(false);
};


  const resetBooking = () => {
  setStep(0);
  setSelectedService('');
  setSelectedSchedule(null);
  setClientData({ name: '', email: '', phone: '', message: '' });
  setIsComplete(false);
  setShowPayment(false); 
  setPaymentData(null); 
  setCurrentPage('home');
};

  const currentService = selectedService ? services[selectedService] : null;
  const availableSchedules = selectedService ? adminSchedules[selectedService] || [] : [];

  // Handlers pentru hover effects
  const handleServiceCardHover = (e, service, isHovering) => {
    if (service.price !== "-") {
      if (isHovering) {
        Object.assign(e.currentTarget.style, servicesPageStyles.serviceCard.hover);
        e.currentTarget.style.borderColor = service.color;
        e.currentTarget.style.boxShadow = `0 8px 25px ${service.color}20`;
      } else {
        Object.assign(e.currentTarget.style, servicesPageStyles.serviceCard.base);
        if (selectedService !== service.id) {
          e.currentTarget.style.borderColor = '#e5e7eb';
        }
        e.currentTarget.style.boxShadow = 'none';
      }
    }
  };

  const handleScheduleCardHover = (e, schedule, isHovering) => {
    if (selectedSchedule?.id !== schedule.id) {
      if (isHovering) {
        Object.assign(e.currentTarget.style, servicesPageStyles.scheduleCard.hover);
        e.currentTarget.style.borderColor = `${currentService?.color}80`;
      } else {
        Object.assign(e.currentTarget.style, servicesPageStyles.scheduleCard.base);
        e.currentTarget.style.borderColor = '#e5e7eb';
      }
    }
  };

  const handleButtonHover = (e, buttonType, isHovering) => {
    const styles = servicesPageStyles.buttons[buttonType];
    if (styles && styles.hover && !e.target.disabled) {
      if (isHovering) {
        Object.assign(e.target.style, styles.hover);
      } else {
        Object.assign(e.target.style, styles.base);
      }
    }
  };

  return (
    <>
      <style>{servicesPageStyles.getGlobalStyles(currentService?.color)}</style>
      
      <div style={servicesPageStyles.container}>
        <div style={servicesPageStyles.maxWidth}>
          
          {/* Header */}
          <div style={servicesPageStyles.header}>
            <button
              onClick={() => setCurrentPage('home')}
              style={servicesPageStyles.backButton.base}
              onMouseOver={(e) => handleButtonHover(e, 'backButton', true)}
              onMouseOut={(e) => handleButtonHover(e, 'backButton', false)}
            >
              <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
              Înapoi la Pagina Principală
            </button>
            
            <h1 style={servicesPageStyles.mainTitle}>
              {step === 0 ? 'Alege Serviciul' : `Programare: ${currentService?.name}`}
            </h1>
            
            {/* Progress Steps */}
            {step > 0 && (
              <div style={servicesPageStyles.progressContainer}>
                {[1, 2, 3].map((stepNum) => (
                  <React.Fragment key={stepNum}>
                    <div style={{
                      ...servicesPageStyles.progressStep,
                      backgroundColor: step >= stepNum ? (currentService?.color || '#ea580c') : '#e5e7eb'
                    }}>
                      {stepNum}
                    </div>
                    {stepNum < 3 && (
                      <div style={{
                        ...servicesPageStyles.progressLine,
                        backgroundColor: step > stepNum ? (currentService?.color || '#ea580c') : '#e5e7eb'
                      }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            
            <div style={servicesPageStyles.stepDescription}>
              {step === 1 && 'Selectează programul săptămânal'}
              {step === 2 && 'Completează datele de contact'}
              {step === 3 && 'Confirmă programarea'}
            </div>
          </div>

          {/* Content */}
          <div style={servicesPageStyles.contentCard}>
            
            {/* Step 0: Service Selection */}
{step === 0 && (
  <div style={servicesPageStyles.servicesGrid}>
    {Object.entries(services).map(([serviceId, service]) => (
      <div 
        key={serviceId} 
        onClick={() => handleServiceSelect(serviceId)}
        style={{
          ...servicesPageStyles.serviceCard.base,
          border: selectedService === serviceId ? `3px solid ${service.color}` : 
                  service.price !== "-" ? '2px solid #e5e7eb' : '2px solid #d1d5db',
          opacity: service.price !== "-" ? 1 : 0.6,
          cursor: service.price !== "-" ? 'pointer' : 'not-allowed'
        }}
        onMouseOver={(e) => handleServiceCardHover(e, service, true)}
        onMouseOut={(e) => handleServiceCardHover(e, service, false)}
      >
        <div style={{
          ...servicesPageStyles.serviceIcon,
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }}>
          <img 
            src={serviceId === 'evaluare' ? '/images/logo_VII_2.png' : '/images/logo_VIII_2.png'}
            alt={service.name}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        <h4 style={servicesPageStyles.serviceTitle}>{service.name}</h4>
        
        <p style={servicesPageStyles.serviceDescription}>
          {service.description}
        </p>
        
        {service.price !== "-" ? (
          <>
            <div style={servicesPageStyles.servicePricing}>
              <div style={{
                ...servicesPageStyles.servicePrice,
                color: service.color
              }}>
                {service.price} 
              </div>
              <div style={servicesPageStyles.serviceDuration}>
                {service.duration} / sesiune
              </div>
            </div>

            <div style={servicesPageStyles.serviceAvailability}>
              {adminSchedules[serviceId]?.length || 0} programe disponibile
            </div>
            
            <div style={{
              ...servicesPageStyles.serviceSelectButton,
              backgroundColor: service.color
            }}>
              Selectează
            </div>
          </>
        ) : (
          <>
            <div style={servicesPageStyles.serviceUnavailable.pricing}>
              <div style={servicesPageStyles.serviceUnavailable.price}>
                În curând
              </div>
              <div style={servicesPageStyles.serviceUnavailable.duration}>
                Pregătim cursul
              </div>
            </div>

            <div style={servicesPageStyles.serviceUnavailable.availability}>
              Cursul nu este încă disponibil
            </div>
            
            <div style={servicesPageStyles.serviceUnavailable.button}>
              Indisponibil
            </div>
          </>
        )}
      </div>
    ))}
  </div>
)}

            {/* Step 1: Schedule Selection */}
            {step === 1 && (
              <div>
                <h3 style={servicesPageStyles.stepTitle}>
                  Programare - {currentService?.name}
                </h3>
                
                <div style={{
                  ...servicesPageStyles.infoBox,
                  borderColor: `${currentService?.color}60`
                }}>
                  <div style={servicesPageStyles.infoBoxHeader}>
                    <Calendar style={{ width: '1rem', height: '1rem', color: currentService?.color }} />
                    <span style={{ fontWeight: '600', color: currentService?.color }}>Program Săptămânal</span>
                  </div>
                  <p style={servicesPageStyles.infoBoxText}>
                    Aceste ore se repetă în fiecare săptămână. Odată înscris, vei participa la aceeași oră în fiecare săptămână.
                  </p>
                </div>

                <div style={servicesPageStyles.schedulesGrid}>
                  {availableSchedules.map((schedule) => (
                    <div 
                      key={schedule.id}
                      onClick={() => setSelectedSchedule(schedule)}
                      style={{
                        ...servicesPageStyles.scheduleCard.base,
                        backgroundColor: selectedSchedule?.id === schedule.id ? '#f0f9ff' : '#f8fafc',
                        border: selectedSchedule?.id === schedule.id ? 
                               `2px solid ${currentService?.color}` : '1px solid #e5e7eb'
                      }}
                      onMouseOver={(e) => handleScheduleCardHover(e, schedule, true)}
                      onMouseOut={(e) => handleScheduleCardHover(e, schedule, false)}
                    >
                      <div style={servicesPageStyles.scheduleHeader}>
                        <div style={{
                          ...servicesPageStyles.scheduleDay,
                          color: currentService?.color
                        }}>
                          {schedule.zi}
                        </div>
                        <div style={{
                          ...servicesPageStyles.scheduleStatus,
                          backgroundColor: selectedSchedule?.id === schedule.id ? currentService?.color : '#e5e7eb',
                          color: selectedSchedule?.id === schedule.id ? 'white' : '#6b7280'
                        }}>
                          {selectedSchedule?.id === schedule.id ? 'SELECTAT' : 'DISPONIBIL'}
                        </div>
                      </div>
                      
                      <div style={servicesPageStyles.scheduleTime}>
                        <Clock style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        <span style={servicesPageStyles.scheduleTimeText}>
                          {schedule.ora}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {availableSchedules.length === 0 && (
                  <div style={servicesPageStyles.emptyState}>
                    <AlertCircle style={servicesPageStyles.emptyStateIcon} />
                    <h4 style={servicesPageStyles.emptyStateTitle}>Nu sunt programe disponibile</h4>
                    <p style={servicesPageStyles.emptyStateText}>
                      Administratorul nu a configurat încă programele pentru acest serviciu.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <div>
                <h3 style={servicesPageStyles.stepTitle}>
                  Datele Tale de Contact
                </h3>
                
                {/* Selection Summary */}
                <div style={{
                  ...servicesPageStyles.summaryBox,
                  borderColor: currentService?.color
                }}>
                  <h4 style={{
                    ...servicesPageStyles.summaryTitle,
                    color: currentService?.color
                  }}>
                    Programare Selectată
                  </h4>
                  <div style={servicesPageStyles.summaryGrid}>
                    <div>
                      <span style={servicesPageStyles.summaryLabel}>Serviciu:</span>
                      <div style={servicesPageStyles.summaryValue}>{currentService?.name}</div>
                    </div>
                    <div>
                      <span style={servicesPageStyles.summaryLabel}>Program:</span>
                      <div style={servicesPageStyles.summaryValue}>
                        {selectedSchedule?.zi} la {selectedSchedule?.ora}
                      </div>
                    </div>
                    <div>
                      <span style={servicesPageStyles.summaryLabel}>Preț:</span>
                      <div style={{
                        ...servicesPageStyles.summaryPrice,
                        color: currentService?.color
                      }}>
                        {currentService?.price} RON/lună
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div style={servicesPageStyles.form}>
                  <div style={servicesPageStyles.formRow}>
                    <div>
                      <label style={servicesPageStyles.formLabel}>Nume Complet *</label>
                      <input
                        type="text"
                        value={clientData.name}
                        onChange={(e) => setClientData({...clientData, name: e.target.value})}
                        style={servicesPageStyles.formInput}
                        placeholder="Introdu numele complet"
                      />
                    </div>
                    
                    <div>
                      <label style={servicesPageStyles.formLabel}>Email *</label>
                      <input
                        type="email"
                        value={clientData.email}
                        onChange={(e) => setClientData({...clientData, email: e.target.value})}
                        style={servicesPageStyles.formInput}
                        placeholder="email@exemplu.ro"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={servicesPageStyles.formLabel}>Număr de Telefon *</label>
                    <input
                      type="tel"
                      value={clientData.phone}
                      onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                      style={servicesPageStyles.formInput}
                      placeholder="+40 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label style={servicesPageStyles.formLabel}>Mesaj (opțional)</label>
                    <textarea
                      value={clientData.message}
                      onChange={(e) => setClientData({...clientData, message: e.target.value})}
                      rows={3}
                      style={servicesPageStyles.formTextarea}
                      placeholder="Detalii suplimentare sau întrebări..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Final Confirmation */}
            {step === 3 && (
              <div>
                <h3 style={servicesPageStyles.stepTitle}>Confirmă Programarea</h3>
                
                {/* Final Summary */}
                <div style={{
                  ...servicesPageStyles.finalSummary,
                  borderColor: currentService?.color
                }}>
                  <h4 style={{
                    ...servicesPageStyles.finalSummaryTitle,
                    color: currentService?.color
                  }}>
                    Sumar Programare
                  </h4>
                  
                  <div style={servicesPageStyles.finalSummaryContent}>
                    <div style={servicesPageStyles.finalSummaryRow}>
                      <span style={servicesPageStyles.finalSummaryLabel}>Serviciu:</span>
                      <span style={servicesPageStyles.finalSummaryValue}>{currentService?.name}</span>
                    </div>
                    
                    <div style={servicesPageStyles.finalSummaryRow}>
                      <span style={servicesPageStyles.finalSummaryLabel}>Program săptămânal:</span>
                      <span style={servicesPageStyles.finalSummaryValue}>
                        {selectedSchedule?.zi} la {selectedSchedule?.ora}
                      </span>
                    </div>
                    
                    {/* Afișăm datele utilizatorului autentificat sau din formular */}
                    <div style={servicesPageStyles.finalSummaryRow}>
                    <span style={servicesPageStyles.finalSummaryLabel}>Client:</span>
                    <span style={servicesPageStyles.finalSummaryValue}>
                      {currentUser && userData 
                        ? `${userData.prenumeElev} ${userData.numeElev}` // ✅ Corect
                        : clientData.name
                      }
                    </span>
                  </div>
                    
                    <div style={servicesPageStyles.finalSummaryRow}>
                      <span style={servicesPageStyles.finalSummaryLabel}>Email:</span>
                      <span style={servicesPageStyles.finalSummaryValue}>
                        {currentUser && userData ? userData.email : clientData.email}
                      </span>
                    </div>
                    
                    <div style={servicesPageStyles.finalSummaryRow}>
                      <span style={servicesPageStyles.finalSummaryLabel}>Telefon:</span>
                      <span style={servicesPageStyles.finalSummaryValue}>
                        {currentUser && userData ? userData.telefon : clientData.phone}
                      </span>
                    </div>
                    
                    {clientData.message && (
                      <div>
                        <span style={servicesPageStyles.finalSummaryLabel}>Mesaj:</span>
                        <div style={servicesPageStyles.finalSummaryMessage}>
                          {clientData.message}
                        </div>
                      </div>
                    )}
                    
                    <hr style={servicesPageStyles.divider} />
                    
                    <div style={servicesPageStyles.totalRow}>
                      <span style={servicesPageStyles.totalLabel}>Total lunar:</span>
                      <span style={{
                        ...servicesPageStyles.totalPrice,
                        color: currentService?.color
                      }}>
                        {currentService?.price} RON
                      </span>
                    </div>
                    
                    <div style={{
                      ...servicesPageStyles.confirmationBadge,
                      color: currentService?.color,
                      borderColor: `${currentService?.color}40`
                    }}>
                      📚 {currentUser && userData 
                        ? 'Înscrierea va fi confirmată instantaneu!' 
                        : 'Programare confirmată pentru cursurile săptămânale'
                      }
                    </div>
                  </div>
                </div>

                {/* Status pentru utilizatori autentificați vs neautentificați */}
                <div style={servicesPageStyles.termsBox}>
                  {currentUser && userData ? (
                    <>
                      ✅ <strong style={{ color: '#10b981' }}>Înscrierea instantanee</strong><br/>
                      • Contul tău este verificat - înscrierea se face automat<br/>
                      • Vei vedea cursul în pagina ta de profil imediat după confirmare<br/>
                      • Link-ul cursului va apărea când profesorul îl va adăuga<br/>
                      • Poți gestiona înscrierea din pagina de profil
                    </>
                  ) : (
                    <>
                      📞 <strong style={{ color: '#10b981' }}>Sesiune programată cu succes!</strong><br/>
                      • Poți vedea programarile tale din pagina de profil<br/>
                    </>
                  )}
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  style={{
                    ...servicesPageStyles.buttons.confirm.base,
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
                      <div style={servicesPageStyles.spinner} />
                      {currentUser && userData ? 'Se înscrie...' : 'Se salvează programarea...'}
                    </>
                  ) : (
                    <>
                      <Check style={{ width: '1rem', height: '1rem' }} />
                      {currentUser && userData ? 'Înscrie-mă la curs!' : 'Confirmă Programarea'}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{
              ...servicesPageStyles.navigationButtons,
              justifyContent: step === 0 ? 'center' : 'space-between'
            }}>
              {step > 0 && step < 3 && (
                <button
                  onClick={goBackStep}
                  disabled={isLoading}
                  style={{
                    ...servicesPageStyles.buttons.back.base,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1
                  }}
                  onMouseOver={(e) => handleButtonHover(e, 'back', true)}
                  onMouseOut={(e) => handleButtonHover(e, 'back', false)}
                >
                  <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                  Înapoi
                </button>
              )}
              
              {step > 0 && step < 3 && (
                <button
                  onClick={handleContinue}
                  disabled={
                    (step === 1 && !selectedSchedule) ||
                    (step === 2 && (!clientData.name || !clientData.email || !clientData.phone))
                  }
                  style={{
                    ...servicesPageStyles.buttons.continue.base,
                    backgroundColor: currentService?.color || '#ea580c',
                    opacity: (step === 1 && !selectedSchedule) || 
                             (step === 2 && (!clientData.name || !clientData.email || !clientData.phone)) ? 0.5 : 1
                  }}
                >
                  Continuă
                  <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                </button>
              )}
            </div>
          </div>
        </div>

{/* Auth Modal */}
        {showAuthModal && (
          <div style={servicesPageStyles.modal.overlay}>
            <div style={{
              ...servicesPageStyles.modal.content,
              maxWidth: '500px',
              padding: '2rem'
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
                  width: '3rem', 
                  height: '3rem', 
                  color: currentService?.color || '#ea580c',
                  marginBottom: '1rem' 
                }} />
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  marginBottom: '0.5rem' 
                }}>
                  Cont Necesar
                </h2>
                <p style={{ color: '#6b7280' }}>
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
                  fontSize: '0.875rem'
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
                      padding: '0.75rem',
                      backgroundColor: !showRegister ? (currentService?.color || '#ea580c') : 'transparent',
                      color: !showRegister ? 'white' : '#6b7280',
                      border: `2px solid ${currentService?.color || '#ea580c'}`,
                      borderRadius: '8px 0 0 8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Logare
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: showRegister ? (currentService?.color || '#ea580c') : 'transparent',
                      color: showRegister ? 'white' : '#6b7280',
                      border: `2px solid ${currentService?.color || '#ea580c'}`,
                      borderRadius: '0 8px 8px 0',
                      fontWeight: '600',
                      cursor: 'pointer'
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
                        color: '#374151'
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
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem',
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
                        color: '#374151'
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
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem',
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
                        padding: '0.75rem',
                        backgroundColor: currentService?.color || '#ea580c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
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
                      <span style={{ margin: '0 1rem', fontSize: '0.875rem' }}>sau</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    </div>
                    
                    <button
                      onClick={handleGoogleLogin}
                      disabled={authLoading}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem', 
                          fontWeight: '500',
                          color: '#374151'
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
                            padding: '0.75rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
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
                          color: '#374151'
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
                            padding: '0.75rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
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
                        color: '#374151'
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
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem',
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
                        color: '#374151'
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
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          boxSizing: 'border-box'
                        }}
                        placeholder="+40 XXX XXX XXX"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem', 
                          fontWeight: '500',
                          color: '#374151'
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
                            padding: '0.75rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
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
                          color: '#374151'
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
                            padding: '0.75rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
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
                        padding: '0.75rem',
                        backgroundColor: currentService?.color || '#ea580c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: authLoading ? 'not-allowed' : 'pointer',
                        opacity: authLoading ? 0.7 : 1
                      }}
                    >
                      {authLoading ? 'Se creează contul...' : 'Creează Cont'}
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
                      <span style={{ margin: '0 1rem', fontSize: '0.875rem' }}>sau</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    </div>
                    
                    <button
                      onClick={handleGoogleLogin}
                      disabled={authLoading}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
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


{/* Modal de plata */}
{showPayment && paymentData && (
  <div style={servicesPageStyles.modal.overlay}>
    <div
      style={{
        ...servicesPageStyles.modal.content,
        maxWidth: "600px",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <CreditCard
            style={{
              width: "2.5rem",
              height: "2.5rem",
              color: currentService?.color || "#ea580c",
            }}
          />
          <NTPLogo
            color={currentService?.color || "#ea580c"}
            version="orizontal"
            secret="154714"
            style={{ height: "40px" }}
          />
        </div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "0.5rem",
          }}
        >
          Finalizează plata
        </h2>
        <p style={{ color: "#6b7280" }}>
          Vei fi redirecționat către platforma securizată Netopia pentru a
          finaliza plata.
        </p>
      </div>

      {/* Sumar comanda */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3
          style={{
            margin: "0 0 1rem 0",
            fontSize: "1.1rem",
            fontWeight: "600",
          }}
        >
          Sumar comandă
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span>{currentService?.name}</span>
          <span>{currentService?.priceValue} RON</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span>
            Program: {selectedSchedule?.zi} {selectedSchedule?.ora}
          </span>
        </div>
        <hr
          style={{
            margin: "1rem 0",
            border: "none",
            borderTop: "1px solid #e2e8f0",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "600",
          }}
        >
          <span>Total de plată:</span>
          <span style={{ color: currentService?.color }}>
            {currentService?.priceValue} RON
          </span>
        </div>
      </div>

      {/* Info securitate */}
      <div
        style={{
          backgroundColor: "#f0f9ff",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          fontSize: "0.875rem",
          color: "#0369a1",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <Shield style={{ width: "1rem", height: "1rem" }} />
          <strong>Plată 100% securizată</strong>
        </div>
        <ul style={{ margin: "0", paddingLeft: "1.5rem" }}>
          <li>Toate tranzacțiile sunt protejate SSL</li>
          <li>Datele cardului nu sunt stocate pe serverele noastre</li>
          <li>Poți plăti cu card Visa, MasterCard sau PayPal</li>
          <li>Vei primi confirmarea pe email imediat</li>
        </ul>
      </div>

      {/* Butoane */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={handlePaymentCancel}
          style={{
            flex: 1,
            padding: "0.75rem",
            backgroundColor: "#f3f4f6",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Anulează
        </button>
        <button
          onClick={async () => {
            setPaymentLoading(true);
            try {
              // Folosește funcția reală Netopia
              const functions = getFunctions();
              const createPayment = httpsCallable(functions, "createPayment");

              console.log("Calling createPayment with data:", paymentData);

              const result = await createPayment(paymentData);

              if (result.data.success) {
                console.log(
                  "Redirecting to Netopia payment:",
                  result.data.paymentUrl
                );
                window.location.href = result.data.paymentUrl;
              } else {
                throw new Error(
                  result.data.message || "Eroare la generarea plății"
                );
              }
            } catch (error) {
              console.error(
                "Eroare detaliată la inițierea plății:",
                error
              );
              if (error.code) {
                alert(`Eroare: ${error.code} - ${error.message}`);
              } else {
                alert(
                  "Eroare la inițierea plății. Verifică consola pentru detalii."
                );
              }
              setPaymentLoading(false);
            }
          }}
          disabled={paymentLoading}
          style={{
            flex: 2,
            padding: "0.75rem",
            backgroundColor: currentService?.color || "#ea580c",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: paymentLoading ? "not-allowed" : "pointer",
            opacity: paymentLoading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {paymentLoading ? <>Procesăm plata...</> : <>Plătește {currentService?.priceValue} RON</>}
        </button>
      </div>
    </div>
  </div>
)}

        {/* Success Modal */}
        {isComplete && (
          <div style={servicesPageStyles.modal.overlay}>
            <div style={servicesPageStyles.modal.content}>
              <div style={servicesPageStyles.modal.icon}>
                <Check style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
              </div>
              
              <h2 style={servicesPageStyles.modal.title}>
                Programare Confirmată!
              </h2>
              
              <p style={servicesPageStyles.modal.message}>
                Programarea ta pentru <strong style={{ color: currentService?.color }}>{currentService?.name}</strong> a fost înregistrată cu succes.
                <br/>
                Program: <strong style={{ color: '#1f2937' }}>{selectedSchedule?.zi} la {selectedSchedule?.ora}</strong>
                <br/><br/>
                Vei fi contactat în următoarele 24 de ore pentru confirmarea finală și detaliile sesiunii!
              </p>
              
              <button
                onClick={resetBooking}
                style={servicesPageStyles.modal.button.base}
                onMouseOver={(e) => Object.assign(e.target.style, servicesPageStyles.modal.button.hover)}
                onMouseOut={(e) => Object.assign(e.target.style, servicesPageStyles.modal.button.base)}
              >
                Înapoi la Pagina Principală
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ServicesPage;
