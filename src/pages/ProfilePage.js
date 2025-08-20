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
import { doc, setDoc, serverTimestamp, collection, addDoc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { profilePageStyles } from './ProfilePageStyles';

const ProfilePage = () => {
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
    } catch (error) {
      console.error('Eroare la încărcarea înscrieriolor:', error);
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
      case 'evaluare': return 'Clasa a 7-a (Evaluare Națională)';
      case 'bac': return 'Clasa a 8-a (Bacalaureat)';
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
      <div style={profilePageStyles.authContainer}>
        <div style={profilePageStyles.authCard}>
          <h1 style={profilePageStyles.authTitle}>
            {showRegister ? 'Înregistrare' : 'Autentificare'}
          </h1>

          {error && (
            <div style={profilePageStyles.errorMessage}>
              {error}
            </div>
          )}

          {!showRegister ? (
            <form onSubmit={handleLogin} style={profilePageStyles.form}>
              <div>
                <label style={profilePageStyles.label}>Email</label>
                <div style={profilePageStyles.inputWrapper}>
                  <Mail style={profilePageStyles.inputIcon} />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                    disabled={loading}
                    style={{...profilePageStyles.input, ...profilePageStyles.inputWithIcon}}
                    placeholder="email@exemplu.ro"
                  />
                </div>
              </div>

              <div>
                <label style={profilePageStyles.label}>Parolă</label>
                <div style={profilePageStyles.inputWrapper}>
                  <Lock style={profilePageStyles.inputIcon} />
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                    disabled={loading}
                    style={{...profilePageStyles.input, ...profilePageStyles.inputWithIcon}}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...profilePageStyles.submitButton,
                  backgroundColor: loading ? '#9ca3af' : '#2563eb'
                }}
              >
                {loading ? 'Se autentifică...' : 'Autentificare'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={profilePageStyles.form}>
              <div style={profilePageStyles.formRow}>
                <div>
                  <label style={profilePageStyles.label}>Nume elev</label>
                  <input
                    type="text"
                    value={registerForm.numeElev}
                    onChange={(e) => setRegisterForm({...registerForm, numeElev: e.target.value})}
                    required
                    disabled={loading}
                    style={profilePageStyles.input}
                    placeholder="Nume elev"
                  />
                </div>
                <div>
                  <label style={profilePageStyles.label}>Prenume elev</label>
                  <input
                    type="text"
                    value={registerForm.prenumeElev}
                    onChange={(e) => setRegisterForm({...registerForm, prenumeElev: e.target.value})}
                    required
                    disabled={loading}
                    style={profilePageStyles.input}
                    placeholder="Prenume elev"
                  />
                </div>
              </div>

              <div>
                <label style={profilePageStyles.label}>Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  required
                  disabled={loading}
                  style={profilePageStyles.input}
                  placeholder="email@exemplu.ro"
                />
              </div>

              <div>
                <label style={profilePageStyles.label}>Telefon</label>
                <input
                  type="tel"
                  value={registerForm.telefon}
                  onChange={(e) => setRegisterForm({...registerForm, telefon: e.target.value})}
                  required
                  disabled={loading}
                  style={profilePageStyles.input}
                  placeholder="+40 123 456 789"
                />
              </div>

              <div style={profilePageStyles.formRow}>
                <div>
                  <label style={profilePageStyles.label}>Parolă</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    required
                    disabled={loading}
                    style={profilePageStyles.input}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label style={profilePageStyles.label}>Confirmă parola</label>
                  <input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    required
                    disabled={loading}
                    style={profilePageStyles.input}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...profilePageStyles.submitButton,
                  backgroundColor: loading ? '#9ca3af' : '#10b981'
                }}
              >
                {loading ? 'Se înregistrează...' : 'Înregistrare'}
              </button>
            </form>
          )}

          <div style={profilePageStyles.authSwitch}>
            <button
              onClick={() => setShowRegister(!showRegister)}
              disabled={loading}
              style={profilePageStyles.authSwitchButton}
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
      <div style={profilePageStyles.loadingContainer}>
        <div style={profilePageStyles.loadingCard}>
          <style>{profilePageStyles.spinnerAnimation}</style>
          
          <div style={profilePageStyles.spinner}></div>
          
          <h2 style={profilePageStyles.loadingTitle}>
            {fixingDocument ? '🔧 Se repară profilul...' : '⏳ Se încarcă profilul...'}
          </h2>
          
          <p style={profilePageStyles.loadingText}>
            {fixingDocument 
              ? 'Creez documentul lipsă în baza de date. Vă rog să așteptați...'
              : 'Încărc datele profilului dumneavoastră. Dacă durează prea mult, voi repara automat problema.'
            }
          </p>

          <div style={profilePageStyles.statusBox}>
            <strong>Status:</strong><br/>
            User ID: {currentUser.uid}<br/>
            Email: {currentUser.email}<br/>
            {fixingDocument ? '🔧 Reparare în curs...' : '⏳ Aștept încărcarea...'}
          </div>
          
          {!fixingDocument && (
            <div style={profilePageStyles.actionButtons}>
              <button 
                onClick={handleManualFix}
                style={profilePageStyles.fixButton}
              >
                <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                🔧 Repară acum
              </button>
              
              <button
                onClick={handleLogout}
                style={profilePageStyles.logoutButton}
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
    <div style={profilePageStyles.mainContainer}>
      <style>{profilePageStyles.spinnerAnimation}</style>
      
      <div style={profilePageStyles.content}>
        {/* Header */}
        <div style={profilePageStyles.header}>
          <div style={profilePageStyles.userInfo}>
            <div style={profilePageStyles.avatar}>
              <User style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <div>
              <h1 style={profilePageStyles.userName}>
                {userData.prenumeElev} {userData.numeElev}
              </h1>
              <p style={profilePageStyles.userType}>
                {userData.tipCont === 'admin' ? 'Administrator' : 'Elev'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={profilePageStyles.headerLogoutButton}
          >
            <LogOut style={{ width: '1rem', height: '1rem' }} />
            Deconectare
          </button>
        </div>

        {/* Content pentru admin */}
        {userData.tipCont === 'admin' && (
          <div style={profilePageStyles.adminContent}>
            {/* Add new schedule */}
            <div style={profilePageStyles.card}>
              <h2 style={profilePageStyles.cardTitle}>
                <Plus style={{ width: '1.5rem', height: '1.5rem' }} />
                Adaugă program nou
              </h2>
              
              <form onSubmit={addNewSchedule} style={profilePageStyles.scheduleForm}>
                <div style={profilePageStyles.scheduleFormRow}>
                  <div>
                    <label style={profilePageStyles.label}>Ziua săptămânii</label>
                    <select
                      value={newSchedule.zi}
                      onChange={(e) => setNewSchedule({...newSchedule, zi: e.target.value})}
                      disabled={loading}
                      style={profilePageStyles.select}
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
                    <label style={profilePageStyles.label}>Ora</label>
                    <input
                      type="time"
                      value={newSchedule.ora}
                      onChange={(e) => setNewSchedule({...newSchedule, ora: e.target.value})}
                      required
                      disabled={loading}
                      style={profilePageStyles.input}
                    />
                  </div>
                  
                  <div>
                    <label style={profilePageStyles.label}>Clasa</label>
                    <select
                      value={newSchedule.tip}
                      onChange={(e) => setNewSchedule({...newSchedule, tip: e.target.value})}
                      disabled={loading}
                      style={profilePageStyles.select}
                    >
                      <option value="evaluare">Clasa a 7-a (Evaluare)</option>
                      <option value="bac">Clasa a 8-a (Bacalaureat)</option>
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...profilePageStyles.addScheduleButton,
                    backgroundColor: loading ? '#9ca3af' : '#10b981'
                  }}
                >
                  <Calendar style={{ width: '1rem', height: '1rem' }} />
                  {loading ? 'Se adaugă...' : 'Adaugă program'}
                </button>
              </form>
            </div>

            {/* Existing schedules */}
            <div style={profilePageStyles.card}>
              <h2 style={profilePageStyles.cardTitle}>
                <Calendar style={{ width: '1.5rem', height: '1.5rem' }} />
                Programe existente ({adminSchedules.length})
              </h2>
              
              <div style={profilePageStyles.schedulesList}>
                {adminSchedules.map((schedule) => (
                  <div key={schedule.id} style={{
                    ...profilePageStyles.scheduleItem,
                    borderLeft: `4px solid ${getTipColor(schedule.tip)}`
                  }}>
                    <div style={profilePageStyles.scheduleHeader}>
                      <div>
                        <h3 style={{
                          ...profilePageStyles.scheduleTitle,
                          color: getTipColor(schedule.tip)
                        }}>
                          {getTipText(schedule.tip)}
                        </h3>
                        <div style={profilePageStyles.scheduleInfo}>
                          <div style={profilePageStyles.scheduleInfoItem}>
                            <Calendar style={{ width: '0.9rem', height: '0.9rem' }} />
                            {getZiText(schedule.zi)}
                          </div>
                          <div style={profilePageStyles.scheduleInfoItem}>
                            <Clock style={{ width: '0.9rem', height: '0.9rem' }} />
                            {schedule.ora}
                          </div>
                          <div style={profilePageStyles.scheduleInfoItem}>
                            <Users style={{ width: '0.9rem', height: '0.9rem' }} />
                            {schedule.enrolledCount || 0} înscriși
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Link management */}
                    <div style={profilePageStyles.linkSection}>
                      {editingSchedule === schedule.id ? (
                        <div style={profilePageStyles.linkEditForm}>
                          <input
                            type="url"
                            value={editLink}
                            onChange={(e) => setEditLink(e.target.value)}
                            placeholder="https://meet.google.com/... sau https://zoom.us/..."
                            style={profilePageStyles.linkInput}
                          />
                          <div style={profilePageStyles.linkEditButtons}>
                            <button
                              onClick={() => updateScheduleLink(schedule.id)}
                              disabled={loading}
                              style={profilePageStyles.saveButton}
                            >
                              <Save style={{ width: '0.9rem', height: '0.9rem' }} />
                            </button>
                            <button
                              onClick={cancelEditLink}
                              style={profilePageStyles.cancelButton}
                            >
                              <X style={{ width: '0.9rem', height: '0.9rem' }} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={profilePageStyles.linkDisplay}>
                          {schedule.link ? (
                            <div style={profilePageStyles.linkContainer}>
                              <div style={profilePageStyles.linkText}>
                                {schedule.link}
                              </div>
                              <div style={profilePageStyles.linkActions}>
                                <button
                                  onClick={() => copyLink(schedule.link)}
                                  style={profilePageStyles.copyButton}
                                  title="Copiază link"
                                >
                                  <Copy style={{ width: '0.9rem', height: '0.9rem' }} />
                                </button>
                                <button
                                  onClick={() => window.open(schedule.link, '_blank')}
                                  style={profilePageStyles.openButton}
                                  title="Deschide link"
                                >
                                  <ExternalLink style={{ width: '0.9rem', height: '0.9rem' }} />
                                </button>
                                <button
                                  onClick={() => startEditLink(schedule)}
                                  style={profilePageStyles.editButton}
                                  title="Editează link"
                                >
                                  <Edit style={{ width: '0.9rem', height: '0.9rem' }} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditLink(schedule)}
                              style={profilePageStyles.addLinkButton}
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
                  <div style={profilePageStyles.emptyState}>
                    Nu există programe create încă
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content pentru elev */}
        {userData.tipCont === 'elev' && (
          <div style={profilePageStyles.studentContent}>
            {/* Cursurile la care este înscris */}
            <div style={profilePageStyles.card}>
              <h2 style={profilePageStyles.cardTitle}>
                <PlayCircle style={{ width: '1.5rem', height: '1.5rem' }} />
                Cursurile mele ({studentEnrollments.length})
              </h2>
              
              {studentEnrollments.length > 0 ? (
                <div style={profilePageStyles.enrollmentsList}>
                  {studentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} style={{
                      ...profilePageStyles.enrollmentItem,
                      borderLeft: `4px solid ${getTipColor(enrollment.schedule?.tip)}`
                    }}>
                      <div style={profilePageStyles.enrollmentHeader}>
                        <h3 style={{
                          ...profilePageStyles.enrollmentTitle,
                          color: getTipColor(enrollment.schedule?.tip)
                        }}>
                          {getTipText(enrollment.schedule?.tip)}
                        </h3>
                        
                        <div style={profilePageStyles.enrollmentInfo}>
                          <div style={profilePageStyles.enrollmentInfoItem}>
                            <Calendar style={{ width: '0.9rem', height: '0.9rem' }} />
                            {getZiText(enrollment.schedule?.zi)} la {enrollment.schedule?.ora}
                          </div>
                          <div style={profilePageStyles.enrollmentInfoItem}>
                            <Clock style={{ width: '0.9rem', height: '0.9rem' }} />
                            {getNextSessionDate(enrollment.schedule?.zi, enrollment.schedule?.ora)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Link pentru curs */}
                      {enrollment.schedule?.link ? (
                        <div style={profilePageStyles.courseLink}>
                          <div style={profilePageStyles.courseLinkAvailable}>
                            <ExternalLink style={{ width: '1.5rem', height: '1.5rem', color: '#22c55e' }} />
                            <div>
                              <h4 style={profilePageStyles.courseLinkTitle}>
                                Link-ul cursului este disponibil
                              </h4>
                              <p style={profilePageStyles.courseLinkSubtitle}>
                                Poți accesa cursul oricând
                              </p>
                            </div>
                          </div>
                          
                          <div style={profilePageStyles.courseLinkContainer}>
                            <div style={profilePageStyles.courseLinkActions}>
                              <input
                                type="text"
                                value={enrollment.schedule.link}
                                readOnly
                                style={profilePageStyles.courseLinkInput}
                              />
                              <button
                                onClick={() => copyLink(enrollment.schedule.link)}
                                style={profilePageStyles.copyButton}
                                title="Copiază link"
                              >
                                <Copy style={{ width: '1rem', height: '1rem' }} />
                              </button>
                              <button
                                onClick={() => window.open(enrollment.schedule.link, '_blank')}
                                style={profilePageStyles.openButton}
                                title="Deschide link"
                              >
                                <ExternalLink style={{ width: '1rem', height: '1rem' }} />
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => window.open(enrollment.schedule.link, '_blank')}
                            style={profilePageStyles.joinCourseButton}
                          >
                            <PlayCircle style={{ width: '1.2rem', height: '1.2rem' }} />
                            Intră la curs
                          </button>
                        </div>
                      ) : (
                        <div style={profilePageStyles.courseLinkPending}>
                          <Clock style={{ 
                            width: '3rem', 
                            height: '3rem', 
                            color: '#f59e0b',
                            margin: '0 auto 1rem'
                          }} />
                          <h4 style={profilePageStyles.courseLinkPendingTitle}>
                            Link-ul cursului va fi încărcat în curând
                          </h4>
                          <p style={profilePageStyles.courseLinkPendingText}>
                            Te vom anunța când link-ul pentru cursul tău va fi disponibil.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={profilePageStyles.noEnrollments}>
                  <PlayCircle style={{ 
                    width: '4rem', 
                    height: '4rem', 
                    color: '#eab308',
                    margin: '0 auto 1rem'
                  }} />
                  <h3 style={profilePageStyles.noEnrollmentsTitle}>
                    Nu ești înscris la niciun curs încă
                  </h3>
                  <p style={profilePageStyles.noEnrollmentsText}>
                    Alege-ți cursul și începe să înveți astăzi!
                  </p>
                  
                  <button 
                    onClick={() => {
                      // Aici vei adăuga navigația către pagina de cursuri
                      alert('Redirecționez către pagina de cursuri...');
                    }}
                    style={profilePageStyles.startLearningButton}
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