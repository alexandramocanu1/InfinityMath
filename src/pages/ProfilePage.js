import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, Calendar, Clock, Copy, ExternalLink, CreditCard, Settings, LogOut, Users, Link as LinkIcon, RefreshCw, PlayCircle, Plus, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  createSchedule,
  getSchedules,
  updateScheduleLink,
  getUserEnrollments,
  enrollUserToSession
} from '../firebase/services';
import { doc, setDoc, serverTimestamp, collection, addDoc, getDocs, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { getProfilePageStyles } from './ProfilePageStyles';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const ProfilePage = ({ setCurrentPage }) => {
  const { currentUser, userData, updateUserData } = useAuth();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fixingDocument, setFixingDocument] = useState(false);
  
  // Pentru admin - gestionarea orelor
  const [adminSchedules, setAdminSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    zi: 'luni',
    ora: '',
    tip: 'evaluare', // evaluare = clasa a 7-a, bac = clasa a 8-a
  });
  
  // Pentru editarea link-urilor
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editLink, setEditLink] = useState('');
  
  // Pentru elevi - cursurile la care sunt înscriși
  const [studentEnrollments, setStudentEnrollments] = useState([]);

  // Add this after your other useState hooks
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
  return () => window.removeEventListener('resize', checkIsMobile);
}, []);

const styles = getProfilePageStyles(isMobile);

  // Google Login
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

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
        updateUserData(userDocData);
      }
      
    } catch (error) {
      console.error('❌ Eroare la Google Auth:', error);
      setError('Eroare la autentificarea cu Google. Te rog să încerci din nou.');
    }
    
    setLoading(false);
  };

  // AUTO-FIX: Creează documentul automat dacă nu există
  useEffect(() => {
    const autoCreateMissingDocument = async () => {
      if (currentUser && !userData && !fixingDocument) {
        console.log('🔧 Auto-fix: Creez documentul lipsă pentru:', currentUser.uid);
        setFixingDocument(true);
        
        try {
          const userDocData = {
            numeElev: currentUser.email.includes('admin') ? 'Admin' : 'Elev',
            prenumeElev: 'Nou',
            email: currentUser.email,
            telefon: '',
            tipCont: currentUser.email.includes('admin') ? 'admin' : 'elev',
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

          await setDoc(doc(db, 'users', currentUser.uid), userDocData);
          console.log('✅ Auto-fix: Document creat cu succes');
          updateUserData(userDocData);
          
        } catch (error) {
          console.error('❌ Auto-fix: Eroare la crearea documentului:', error);
        }
        
        setFixingDocument(false);
      }
    };

    const timer = setTimeout(autoCreateMissingDocument, 2000);
    return () => clearTimeout(timer);
  }, [currentUser, userData, fixingDocument, updateUserData]);

  // Încarcă datele specifice tipului de utilizator
  useEffect(() => {
    if (userData?.tipCont === 'admin') {
      loadAdminSchedules();
    } else if (userData?.tipCont === 'elev') {
      loadStudentEnrollments();
    }
  }, [userData, currentUser]);

  const loadAdminSchedules = async () => {
    try {
      const schedulesRef = collection(db, 'schedules');
      const querySnapshot = await getDocs(schedulesRef);
      const schedules = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdminSchedules(schedules);
    } catch (error) {
      console.error('Eroare la încărcarea orelor:', error);
    }
  };

  const loadStudentEnrollments = async () => {
  try {
    // Pentru elevi cu abonament activ, afișează doar cursul activ
    if (userData?.abonament?.activ) {
      // Caută programul pentru abonamentul activ
      const schedulesRef = collection(db, 'schedules');
      const q = query(
        schedulesRef, 
        where('zi', '==', userData.abonament.ziuaSaptamanii.toLowerCase()),
        where('ora', '==', userData.abonament.oraCurs),
        where('tip', '==', userData.abonament.tip)
      );
      const scheduleSnapshot = await getDocs(q);
      
      if (!scheduleSnapshot.empty) {
        const schedule = { id: scheduleSnapshot.docs[0].id, ...scheduleSnapshot.docs[0].data() };
        
        // Creează un enrollment virtual pentru abonamentul activ
        const activeEnrollment = {
          id: 'active-subscription',
          userId: currentUser.uid,
          scheduleId: schedule.id,
          serviceTip: userData.abonament.tip,
          clientName: `${userData.prenumeElev} ${userData.numeElev}`,
          status: 'active',
          schedule: schedule,
          isActiveSubscription: true
        };
        
        setStudentEnrollments([activeEnrollment]);
      }
    } else {
      // Pentru elevi fără abonament activ, afișează toate înscrieriله
      const enrollmentsRef = collection(db, 'enrollments');
      const q = query(enrollmentsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const enrollments = [];
      for (const doc of querySnapshot.docs) {
        const enrollment = { id: doc.id, ...doc.data() };
        
        // Încarcă și datele programului
        const schedulesRef = collection(db, 'schedules');
        const scheduleQuery = query(schedulesRef, where('__name__', '==', enrollment.scheduleId));
        const scheduleSnapshot = await getDocs(scheduleQuery);
        
        if (!scheduleSnapshot.empty) {
          enrollment.schedule = { id: scheduleSnapshot.docs[0].id, ...scheduleSnapshot.docs[0].data() };
        }
        
        enrollments.push(enrollment);
      }
      
      setStudentEnrollments(enrollments);
    }
  } catch (error) {
    console.error('Eroare la încărcarea înscrieriור:', error);
  }
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginUser(loginForm.email, loginForm.password);
    
    if (result.success) {
      setLoginForm({ email: '', password: '' });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Parolele nu coincid');
      setLoading(false);
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
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleManualFix = async () => {
    if (!currentUser) return;
    
    setFixingDocument(true);
    
    try {
      const userDocData = {
        numeElev: currentUser.email.includes('admin') ? 'Admin' : 'Elev',
        prenumeElev: 'Nou',
        email: currentUser.email,
        telefon: '',
        tipCont: currentUser.email.includes('admin') ? 'admin' : 'elev',
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

      await setDoc(doc(db, 'users', currentUser.uid), userDocData);
      console.log('✅ Manual fix: Document creat cu succes');
      updateUserData(userDocData);
      
    } catch (error) {
      console.error('❌ Manual fix: Eroare:', error);
      alert('Eroare la crearea documentului: ' + error.message);
    }
    
    setFixingDocument(false);
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert('Link copiat în clipboard!');
  };

  // ADMIN: Adaugă program nou
  const addNewSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const scheduleData = {
        zi: newSchedule.zi,
        ora: newSchedule.ora,
        tip: newSchedule.tip,
        link: '',
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
        enrolledCount: 0
      };

      await addDoc(collection(db, 'schedules'), scheduleData);
      
      setNewSchedule({
        zi: 'luni',
        ora: '',
        tip: 'evaluare'
      });
      
      await loadAdminSchedules();
      alert('Program adăugat cu succes!');
    } catch (error) {
      console.error('Eroare la adăugarea programului:', error);
      alert('Eroare la adăugarea programului: ' + error.message);
    }
    
    setLoading(false);
  };

  // ADMIN: Actualizează link-ul unui program
  const updateScheduleLink = async (scheduleId) => {
    if (!editLink.trim()) {
      alert('Te rog introdu un link valid!');
      return;
    }

    setLoading(true);
    try {
      const scheduleRef = doc(db, 'schedules', scheduleId);
      await updateDoc(scheduleRef, {
        link: editLink,
        updatedAt: serverTimestamp()
      });

      setEditingSchedule(null);
      setEditLink('');
      await loadAdminSchedules();
      alert('Link actualizat cu succes!');
    } catch (error) {
      console.error('Eroare la actualizarea link-ului:', error);
      alert('Eroare la actualizarea link-ului: ' + error.message);
    }
    setLoading(false);
  };

  const startEditLink = (schedule) => {
    setEditingSchedule(schedule.id);
    setEditLink(schedule.link || '');
  };

  const cancelEditLink = () => {
    setEditingSchedule(null);
    setEditLink('');
  };

  const getTipText = (tip) => {
    switch(tip) {
      case 'evaluare': return 'Clasa a 7-a';
      case 'bac': return 'Clasa a 8-a (Evaluare Națională)';
      case 'admitere': return 'Admitere Universitate';
      default: return tip;
    }
  };

  const getTipColor = (tip) => {
    switch(tip) {
      case 'evaluare': return '#f59e0b';
      case 'bac': return '#ea580c';
      case 'admitere': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getZiText = (zi) => {
    const zile = {
      'luni': 'Luni',
      'marti': 'Marți', 
      'miercuri': 'Miercuri',
      'joi': 'Joi',
      'vineri': 'Vineri',
      'sambata': 'Sâmbătă',
      'duminica': 'Duminică'
    };
    return zile[zi] || zi;
  };

  const getNextSessionDate = (ziuaSaptamanii, oraCurs) => {
    if (!ziuaSaptamanii || !oraCurs) return null;
    
    const zile = {
      'luni': 1, 'marti': 2, 'miercuri': 3, 'joi': 4, 
      'vineri': 5, 'sambata': 6, 'duminica': 0
    };
    
    const today = new Date();
    const targetDay = zile[ziuaSaptamanii];
    const todayDay = today.getDay();
    
    let daysUntilNext = targetDay - todayDay;
    if (daysUntilNext <= 0) {
      daysUntilNext += 7;
    }
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);
    
    return nextDate.toLocaleDateString('ro-RO', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) + ` la ${oraCurs}`;
  };

  // Cazul 1: Nu există utilizator autentificat
  if (!currentUser) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <h1 style={styles.authTitle}>
            {showRegister ? 'Înregistrare' : 'Autentificare'}
          </h1>

          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          {!showRegister ? (
            <>
              <form onSubmit={handleLogin} style={styles.form}>
                <div>
                  <label style={styles.label}>Email</label>
                  <div style={styles.inputWrapper}>
                    <Mail style={styles.inputIcon} />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                      disabled={loading}
                      style={{...styles.input, ...styles.inputWithIcon}}
                      placeholder="email@exemplu.ro"
                    />
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Parolă</label>
                  <div style={styles.inputWrapper}>
                    <Lock style={styles.inputIcon} />
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                      disabled={loading}
                      style={{...styles.input, ...styles.inputWithIcon}}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    backgroundColor: loading ? '#9ca3af' : '#2563eb'
                  }}
                >
                  {loading ? 'Se autentifică...' : 'Autentificare'}
                </button>
              </form>

              {/* Google Login Button pentru Login */}
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
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
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
                  {loading ? 'Se conectează...' : 'Continuă cu Google'}
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleRegister} style={styles.form}>
                <div style={styles.formRow}>
                  <div>
                    <label style={styles.label}>Nume elev</label>
                    <input
                      type="text"
                      value={registerForm.numeElev}
                      onChange={(e) => setRegisterForm({...registerForm, numeElev: e.target.value})}
                      required
                      disabled={loading}
                      style={styles.input}
                      placeholder="Nume elev"
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Prenume elev</label>
                    <input
                      type="text"
                      value={registerForm.prenumeElev}
                      onChange={(e) => setRegisterForm({...registerForm, prenumeElev: e.target.value})}
                      required
                      disabled={loading}
                      style={styles.input}
                      placeholder="    Prenume elev"
                    />
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    required
                    disabled={loading}
                    style={styles.input}
                    placeholder="email@exemplu.ro"
                  />
                </div>

                <div>
                  <label style={styles.label}>Telefon</label>
                  <input
                    type="tel"
                    value={registerForm.telefon}
                    onChange={(e) => setRegisterForm({...registerForm, telefon: e.target.value})}
                    required
                    disabled={loading}
                    style={styles.input}
                    placeholder="+40 123 456 789"
                  />
                </div>

                <div style={styles.formRow}>
                  <div>
                    <label style={styles.label}>Parolă</label>
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      required
                      disabled={loading}
                      style={styles.input}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Confirmă parola</label>
                    <input
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      required
                      disabled={loading}
                      style={styles.input}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    backgroundColor: loading ? '#9ca3af' : '#10b981'
                  }}
                >
                  {loading ? 'Se înregistrează...' : 'Înregistrare'}
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
                  <span style={{ margin: '0 1rem', fontSize: '0.875rem' }}>sau</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                </div>
                
                <button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
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
                  {loading ? 'Se conectează...' : 'Continuă cu Google'}
                </button>
              </div>
            </>
          )}

          <div style={styles.authSwitch}>
            <button
              onClick={() => setShowRegister(!showRegister)}
              disabled={loading}
              style={styles.authSwitchButton}
            >
              {showRegister ? 'Am deja cont - Autentificare' : 'Nu am cont - Înregistrare'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cazul 2: Utilizator autentificat dar fără userData (cu auto-fix)
  if (currentUser && !userData) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <style>{styles.spinnerAnimation}</style>
          
          <div style={styles.spinner}></div>
          
          <h2 style={styles.loadingTitle}>
            {fixingDocument ? '🔧 Se repară profilul...' : '⏳ Se încarcă profilul...'}
          </h2>
          
          <p style={styles.loadingText}>
            {fixingDocument 
              ? 'Creez documentul lipsă în baza de date. Vă rog să așteptați...'
              : 'Încărc datele profilului dumneavoastră. Dacă durează prea mult, voi repara automat problema.'
            }
          </p>

          <div style={styles.statusBox}>
            <strong>Status:</strong><br/>
            User ID: {currentUser.uid}<br/>
            Email: {currentUser.email}<br/>
            {fixingDocument ? '🔧 Reparare în curs...' : '⏳ Aștept încărcarea...'}
          </div>
          
          {!fixingDocument && (
            <div style={styles.actionButtons}>
              <button 
                onClick={handleManualFix}
                style={styles.fixButton}
              >
                <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                🔧 Repară acum
              </button>
              
              <button
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                Deconectare
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Cazul 3: Tot OK - afișează profilul normal
  return (
    <div style={styles.mainContainer}>
      <style>{styles.spinnerAnimation}</style>
      
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <User style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <div>
              <h1 style={styles.userName}>
                {userData.prenumeElev} {userData.numeElev}
              </h1>
              <p style={styles.userType}>
                {userData.tipCont === 'admin' ? 'Administrator' : 'Elev'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={styles.headerLogoutButton}
          >
            <LogOut style={{ width: '1rem', height: '1rem' }} />
            Deconectare
          </button>
        </div>

        {/* Content pentru admin */}
        {userData.tipCont === 'admin' && (
          <div style={styles.adminContent}>
            {/* Add new schedule */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <Plus style={{ width: '1.5rem', height: '1.5rem' }} />
                Adaugă program nou
              </h2>
              
              <form onSubmit={addNewSchedule} style={styles.scheduleForm}>
                <div style={styles.scheduleFormRow}>
                  <div>
                    <label style={styles.label}>Ziua săptămânii</label>
                    <select
                      value={newSchedule.zi}
                      onChange={(e) => setNewSchedule({...newSchedule, zi: e.target.value})}
                      disabled={loading}
                      style={styles.select}
                    >
                      <option value="luni">Luni</option>
                      <option value="marti">Marți</option>
                      <option value="miercuri">Miercuri</option>
                      <option value="joi">Joi</option>
                      <option value="vineri">Vineri</option>
                      <option value="sambata">Sâmbătă</option>
                      <option value="duminica">Duminică</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={styles.label}>Ora</label>
                    <input
                      type="time"
                      value={newSchedule.ora}
                      onChange={(e) => setNewSchedule({...newSchedule, ora: e.target.value})}
                      required
                      disabled={loading}
                      style={styles.input}
                    />
                  </div>
                  
                  <div>
                    <label style={styles.label}>Clasa</label>
                    <select
                      value={newSchedule.tip}
                      onChange={(e) => setNewSchedule({...newSchedule, tip: e.target.value})}
                      disabled={loading}
                      style={styles.select}
                    >
                      <option value="evaluare">Clasa a 7-a</option>
                      <option value="bac">Clasa a 8-a (Evaluare)</option>
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.addScheduleButton,
                    backgroundColor: loading ? '#9ca3af' : '#10b981'
                  }}
                >
                  <Calendar style={{ width: '1rem', height: '1rem' }} />
                  {loading ? 'Se adaugă...' : 'Adaugă program'}
                </button>
              </form>
            </div>

            {/* Existing schedules */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <Calendar style={{ width: '1.5rem', height: '1.5rem' }} />
                Programe existente ({adminSchedules.length})
              </h2>
              
              <div style={styles.schedulesList}>
                {adminSchedules.map((schedule) => (
                  <div key={schedule.id} style={{
                    ...styles.scheduleItem,
                    borderLeft: `4px solid ${getTipColor(schedule.tip)}`
                  }}>
                    <div style={styles.scheduleHeader}>
                      <div>
                        <h3 style={{
                          ...styles.scheduleTitle,
                          color: getTipColor(schedule.tip)
                        }}>
                          {getTipText(schedule.tip)}
                        </h3>
                        <div style={styles.scheduleInfo}>
                          <div style={styles.scheduleInfoItem}>
                            <Calendar style={{ width: '0.9rem', height: '0.9rem' }} />
                            {getZiText(schedule.zi)}
                          </div>
                          <div style={styles.scheduleInfoItem}>
                            <Clock style={{ width: '0.9rem', height: '0.9rem' }} />
                            {schedule.ora}
                          </div>
                          <div style={styles.scheduleInfoItem}>
                            <Users style={{ width: '0.9rem', height: '0.9rem' }} />
                            {schedule.enrolledCount || 0} înscriși
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Link management */}
                    <div style={styles.linkSection}>
                      {editingSchedule === schedule.id ? (
                        <div style={styles.linkEditForm}>
                          <input
                            type="url"
                            value={editLink}
                            onChange={(e) => setEditLink(e.target.value)}
                            placeholder="https://meet.google.com/... sau https://zoom.us/..."
                            style={styles.linkInput}
                          />
                          <div style={styles.linkEditButtons}>
                            <button
                              onClick={() => updateScheduleLink(schedule.id)}
                              disabled={loading}
                              style={styles.saveButton}
                            >
                              <Save style={{ width: '0.9rem', height: '0.9rem' }} />
                            </button>
                            <button
                              onClick={cancelEditLink}
                              style={styles.cancelButton}
                            >
                              <X style={{ width: '0.9rem', height: '0.9rem' }} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={styles.linkDisplay}>
                          {schedule.link ? (
                            <div style={styles.linkContainer}>
                              <div style={styles.linkText}>
                                {schedule.link}
                              </div>
                              <div style={styles.linkActions}>
                                <button
                                  onClick={() => copyLink(schedule.link)}
                                  style={styles.copyButton}
                                  title="Copiază link"
                                >
                                  <Copy style={{ width: '0.9rem', height: '0.9rem' }} />
                                </button>
                                <button
                                  onClick={() => window.open(schedule.link, '_blank')}
                                  style={styles.openButton}
                                  title="Deschide link"
                                >
                                  <ExternalLink style={{ width: '0.9rem', height: '0.9rem' }} />
                                </button>
                                <button
                                  onClick={() => startEditLink(schedule)}
                                  style={styles.editButton}
                                  title="Editează link"
                                >
                                  <Edit style={{ width: '0.9rem', height: '0.9rem' }} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditLink(schedule)}
                              style={styles.addLinkButton}
                            >
                              <LinkIcon style={{ width: '1rem', height: '1rem' }} />
                              Adaugă link curs
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {adminSchedules.length === 0 && (
                  <div style={styles.emptyState}>
                    Nu există programe create încă
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content pentru elev */}
        {userData.tipCont === 'elev' && (
          <div style={styles.studentContent}>
            {/* Cursurile la care este înscris */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <PlayCircle style={{ width: '1.5rem', height: '1.5rem' }} />
                Cursurile mele ({studentEnrollments.length})
              </h2>
              
              {studentEnrollments.length > 0 ? (
                <div style={styles.enrollmentsList}>
                  {studentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} style={{
                      ...styles.enrollmentItem,
                      borderLeft: `4px solid ${getTipColor(enrollment.schedule?.tip)}`
                    }}>

                      {/* ... */}
    {enrollment.isActiveSubscription && (
      <div style={{
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid #10b981',
        borderRadius: '6px',
        padding: '0.5rem',
        marginBottom: '1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#059669',
        fontWeight: '600'
      }}>
        🎯 Abonament Activ - Acces Complet
      </div>
    )}


                      <div style={styles.enrollmentHeader}>
                        <h3 style={{
                          ...styles.enrollmentTitle,
                          color: getTipColor(enrollment.schedule?.tip)
                        }}>
                          {getTipText(enrollment.schedule?.tip)}
                        </h3>
                        
                        <div style={styles.enrollmentInfo}>
                          <div style={styles.enrollmentInfoItem}>
                            <Calendar style={{ width: '0.9rem', height: '0.9rem' }} />
                            {getZiText(enrollment.schedule?.zi)} la {enrollment.schedule?.ora}
                          </div>
                          <div style={styles.enrollmentInfoItem}>
                            <Clock style={{ width: '0.9rem', height: '0.9rem' }} />
                            {getNextSessionDate(enrollment.schedule?.zi, enrollment.schedule?.ora)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Link pentru curs */}
                      {enrollment.schedule?.link ? (
                        <div style={styles.courseLink}>
                          <div style={styles.courseLinkAvailable}>
                            <ExternalLink style={{ width: '1.5rem', height: '1.5rem', color: '#22c55e' }} />
                            <div>
                              <h4 style={styles.courseLinkTitle}>
                                Link-ul cursului este disponibil
                              </h4>
                            </div>
                          </div>
                          
                          <div style={styles.courseLinkContainer}>
                            <div style={styles.courseLinkActions}>
                              <input
                                type="text"
                                value={enrollment.schedule.link}
                                readOnly
                                style={styles.courseLinkInput}
                              />
                              <button
                                onClick={() => copyLink(enrollment.schedule.link)}
                                style={styles.copyButton}
                                title="Copiază link"
                              >
                                <Copy style={{ width: '1rem', height: '1rem' }} />
                              </button>
                              <button
                                onClick={() => window.open(enrollment.schedule.link, '_blank')}
                                style={styles.openButton}
                                title="Deschide link"
                              >
                                <ExternalLink style={{ width: '1rem', height: '1rem' }} />
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => window.open(enrollment.schedule.link, '_blank')}
                            style={styles.joinCourseButton}
                          >
                            <PlayCircle style={{ width: '1.2rem', height: '1.2rem' }} />
                            Intră la curs
                          </button>
                        </div>
                      ) : (
                        <div style={styles.courseLinkPending}>
                          <Clock style={{ 
                            width: '3rem', 
                            height: '3rem', 
                            color: '#f59e0b',
                            margin: '0 auto 1rem'
                          }} />
                          <h4 style={styles.courseLinkPendingTitle}>
                            Link-ul cursului va fi încărcat în curând
                          </h4>
                          <p style={styles.courseLinkPendingText}>
                            Te vom anunța când link-ul pentru cursul tău va fi disponibil.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.noEnrollments}>
                  <PlayCircle style={{ 
                    width: '4rem', 
                    height: '4rem', 
                    color: '#eab308',
                    margin: '0 auto 1rem'
                  }} />
                  <h3 style={styles.noEnrollmentsTitle}>
                    Nu ești înscris la niciun curs încă
                  </h3>
                  <p style={styles.noEnrollmentsText}>
                    Alege-ți cursul și începe să înveți astăzi!
                  </p>
                  
                  <button 
 onClick={() => {
   setCurrentPage('services');
 }}
 style={styles.startLearningButton}
 onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
 onMouseOut={(e) => e.target.style.backgroundColor = '#eab308'}
>
 <PlayCircle style={{ width: '1.2rem', height: '1.2rem' }} />
 Începe acum
</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;