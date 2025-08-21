import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, Check, ArrowLeft, ArrowRight, BookOpen, AlertCircle, Lock } from 'lucide-react';
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { registerUser, loginUser } from '../firebase/services';
import { db } from '../firebase/config';
import { servicesPageStyles } from './ServicesPageStyles';

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

  const services = {
    evaluare: { 
      name: 'Clasa a 7-a', 
      price: '60 RON / Sesiune', 
      duration: '1h 30 minute', 
      color: '#f59e0b' // galben
    },
    bac: { 
      name: 'Clasa a 8-a', 
      price: '60 RON / Sesiune', 
      duration: '1h 30 minute', 
      color: '#ea580c' // portocaliu
    }
  };

  // Încarcă programele din Firebase la montarea componentei
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
            // Nu includem link-ul pentru securitate
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

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    
    try {
      if (currentUser && userData) {
        // Utilizator autentificat - înscrie direct cu datele din profil
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
          status: 'confirmed' // Utilizatorii autentificați sunt confirmați automat
        };
        
        // Adăugăm înscrierea în colecția 'enrollments'
        await addDoc(collection(db, 'enrollments'), enrollmentData);
        
        // Incrementăm numărul de înscriși la program
        const scheduleRef = doc(db, 'schedules', selectedSchedule.id);
        await updateDoc(scheduleRef, {
          enrolledCount: increment(1)
        });
        
        console.log('User enrollment saved:', enrollmentData);
        
      } else {
        // Utilizator neautentificat - salvează cu datele din formular
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
          status: 'pending' // Utilizatorii neautentificați rămân în așteptare
        };
        
        await addDoc(collection(db, 'enrollments'), enrollmentData);
        console.log('Guest enrollment saved:', enrollmentData);
      }
      
      setIsComplete(true);
      
    } catch (error) {
      console.error('Eroare la salvarea programării:', error);
      alert('Eroare la salvarea programării. Te rog să încerci din nou.');
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
                      backgroundColor: service.price !== "-" ? service.color : '#9ca3af'
                    }}>
                      <BookOpen style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
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
                          ? `${userData.prenumeElev} ${userData.numeElev}`
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
                      • Vei primi email cu detaliile complete și link-ul pentru sesiunea online<br/>
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
