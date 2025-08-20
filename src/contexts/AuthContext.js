import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('=== AuthContext Debug ===');
  console.log('currentUser:', currentUser);
  console.log('userData:', userData);
  console.log('loading:', loading);

  const updateUserData = (data) => {
    console.log('🔄 updateUserData called with:', data);
    setUserData(data);
  };

  // Funcție separată pentru încărcarea datelor utilizatorului
  const loadUserData = async (user) => {
    try {
      console.log('🔄 Încerc să încarc datele pentru:', user.uid);
      
      const userDocRef = doc(db, 'users', user.uid);
      console.log('📄 Document reference:', userDocRef.path);
      
      const userDocSnap = await getDoc(userDocRef);
      console.log('📄 Document exists:', userDocSnap.exists());
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log('✅ Date utilizator încărcate:', userData);
        setUserData(userData);
        return true;
      } else {
        console.log('❌ Documentul utilizatorului nu există');
        
        // Încearcă să aștepte puțin și să încerce din nou (pentru cazurile când documentul este în curs de creare)
        console.log('🔄 Încerc din nou după 2 secunde...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const retryDocSnap = await getDoc(userDocRef);
        if (retryDocSnap.exists()) {
          const userData = retryDocSnap.data();
          console.log('✅ Date utilizator încărcate la retry:', userData);
          setUserData(userData);
          return true;
        } else {
          console.log('❌ Documentul încă nu există după retry');
          setUserData(null);
          return false;
        }
      }
    } catch (error) {
      console.error('❌ Eroare la încărcarea datelor utilizatorului:', error);
      console.error('❌ Detalii eroare:', error.message);
      setUserData(null);
      return false;
    }
  };

  useEffect(() => {
    console.log('🔄 AuthContext useEffect started');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', user ? `User ${user.uid}` : 'No user');
      
      if (user) {
        console.log('✅ Utilizator autentificat:', user.uid);
        console.log('📧 Email:', user.email);
        setCurrentUser(user);
        
        // Încarcă datele utilizatorului
        const success = await loadUserData(user);
        if (!success) {
          console.log('⚠️ Nu s-au putut încărca datele utilizatorului');
        }
      } else {
        console.log('❌ Niciun utilizator autentificat');
        setCurrentUser(null);
        setUserData(null);
      }
      
      console.log('✅ Setez loading = false');
      setLoading(false);
    });

    return () => {
      console.log('🔄 AuthContext cleanup');
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    updateUserData,
    loading,
    // Adaugă o funcție pentru reîncărcarea manuală a datelor
    reloadUserData: () => {
      if (currentUser) {
        console.log('🔄 Manual reload pentru:', currentUser.uid);
        return loadUserData(currentUser);
      }
      return Promise.resolve(false);
    }
  };

  // Loading screen pentru inițializare
  if (loading) {
    console.log('⏳ AuthContext is loading...');
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#666' }}>Inițializare aplicație...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  console.log('✅ AuthContext rendering children');
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};