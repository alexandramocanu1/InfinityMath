// src/firebase/services.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { auth, db } from './config';

// ===== AUTHENTICATION SERVICES =====

export const registerUser = async (userData) => {
  try {
    console.log('🔄 Începe înregistrarea pentru:', userData.email);
    
    // Creează contul de autentificare
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;
    console.log('✅ Utilizator creat în Auth:', user.uid);

    // Determină tipul de cont (admin dacă email-ul conține "admin")
    const tipCont = userData.email.includes('admin') ? 'admin' : userData.tipCont;
    console.log('📝 Tip cont determinat:', tipCont);

    // Creează documentul utilizatorului în Firestore
    const userDocData = {
      nume: userData.nume,
      prenume: userData.prenume,
      email: userData.email,
      telefon: userData.telefon,
      tipCont: tipCont,
      createdAt: serverTimestamp(),
      subscriptie: {
        activa: false,
        tip: 'evaluare',
        pret: '0 RON',
        dataExpirare: null,
        recurenta: false
      },
      copii: []
    };

    console.log('📝 Creez document în Firestore pentru:', user.uid);
    
    // Folosește setDoc cu merge pentru a evita suprascrieri accidentale
    await setDoc(doc(db, 'users', user.uid), userDocData, { merge: true });
    
    // Verifică imediat dacă documentul a fost creat
    const verifyDoc = await getDoc(doc(db, 'users', user.uid));
    if (verifyDoc.exists()) {
      console.log('✅ Document verificat în Firestore:', verifyDoc.data());
    } else {
      console.error('❌ Documentul nu a fost creat în Firestore');
      throw new Error('Documentul utilizatorului nu a fost creat');
    }

    return { success: true, user };
  } catch (error) {
    console.error('❌ Eroare la înregistrare:', error);
    console.error('❌ Detalii eroare:', error.code, error.message);
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log('🔄 Începe autentificarea pentru:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Autentificare reușită pentru:', userCredential.user.uid);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('❌ Eroare la autentificare:', error);
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ Deconectare reușită');
    return { success: true };
  } catch (error) {
    console.error('❌ Eroare la deconectare:', error);
    return { success: false, error: error.message };
  }
};

// ===== USER DATA SERVICES =====

export const getUserData = async (userId) => {
  try {
    console.log('🔄 Obțin datele pentru utilizatorul:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      console.log('✅ Date utilizator găsite:', userDoc.data());
      return { success: true, data: userDoc.data() };
    } else {
      console.log('❌ Documentul utilizatorului nu există');
      return { success: false, error: 'Utilizatorul nu există în baza de date' };
    }
  } catch (error) {
    console.error('❌ Eroare la obținerea datelor utilizatorului:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserData = async (userId, updateData) => {
  try {
    await updateDoc(doc(db, 'users', userId), updateData);
    return { success: true };
  } catch (error) {
    console.error('Eroare la actualizarea datelor:', error);
    return { success: false, error: error.message };
  }
};

// ===== SUBSCRIPTION SERVICES =====

export const updateSubscription = async (userId, subscriptionData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      subscriptie: subscriptionData
    });
    return { success: true };
  } catch (error) {
    console.error('Eroare la actualizarea abonamentului:', error);
    return { success: false, error: error.message };
  }
};

export const activateSubscription = async (userId, subscriptionType, pricePerMonth) => {
  try {
    const subscriptionData = {
      activa: true,
      tip: subscriptionType,
      pret: `${pricePerMonth} RON`,
      dataExpirare: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 zile
      recurenta: true,
      dataActivare: new Date().toISOString().split('T')[0]
    };

    await updateDoc(doc(db, 'users', userId), {
      subscriptie: subscriptionData
    });

    return { success: true, subscription: subscriptionData };
  } catch (error) {
    console.error('Eroare la activarea abonamentului:', error);
    return { success: false, error: error.message };
  }
};

// ===== CHILDREN MANAGEMENT =====

export const addChild = async (userId, childData) => {
  try {
    const childInfo = {
      id: Date.now().toString(), // ID simplu pentru demo
      nume: childData.nume,
      prenume: childData.prenume,
      varsta: childData.varsta,
      clasa: childData.clasa,
      tipPregatire: childData.tipPregatire,
      dataAdaugarii: new Date().toISOString().split('T')[0]
    };

    // Adaugă copilul la array-ul din documentul părintelui
    await updateDoc(doc(db, 'users', userId), {
      copii: arrayUnion(childInfo)
    });

    return { success: true, child: childInfo };
  } catch (error) {
    console.error('Eroare la adăugarea copilului:', error);
    return { success: false, error: error.message };
  }
};

export const removeChild = async (userId, childId) => {
  try {
    // Obține datele utilizatorului
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return { success: false, error: 'Utilizatorul nu există' };
    }

    const userData = userDoc.data();
    const updatedChildren = userData.copii.filter(child => child.id !== childId);

    await updateDoc(doc(db, 'users', userId), {
      copii: updatedChildren
    });

    return { success: true };
  } catch (error) {
    console.error('Eroare la eliminarea copilului:', error);
    return { success: false, error: error.message };
  }
};

// ===== SESSION SERVICES (pentru admin) =====

export const createSession = async (sessionData, adminId) => {
  try {
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...sessionData,
      participanti: 0,
      createdBy: adminId,
      createdAt: serverTimestamp()
    });
    return { success: true, sessionId: docRef.id };
  } catch (error) {
    console.error('Eroare la crearea sesiunii:', error);
    return { success: false, error: error.message };
  }
};

export const getSessions = async () => {
  try {
    const q = query(collection(db, 'sessions'));
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ Sesiuni obținute:', sessions.length);
    return { success: true, sessions };
  } catch (error) {
    console.error('Eroare la obținerea sesiunilor:', error);
    return { success: false, error: error.message };
  }
};

export const getSessionsByType = async (tipCurs) => {
  try {
    const q = query(
      collection(db, 'sessions'), 
      where('tip', '==', tipCurs)
    );
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, sessions };
  } catch (error) {
    console.error('Eroare la obținerea sesiunilor:', error);
    return { success: false, error: error.message };
  }
};

// ===== ENROLLMENT SERVICES =====

export const enrollUserToSession = async (userId, sessionId) => {
  try {
    // Verifică dacă utilizatorul este deja înscris
    const q = query(
      collection(db, 'enrollments'),
      where('userId', '==', userId),
      where('sessionId', '==', sessionId),
      where('status', '==', 'active')
    );
    
    const existingEnrollments = await getDocs(q);
    if (!existingEnrollments.empty) {
      return { success: false, error: 'Utilizatorul este deja înscris la această sesiune' };
    }

    // Creează înscrierea
    await addDoc(collection(db, 'enrollments'), {
      userId,
      sessionId,
      enrolledAt: serverTimestamp(),
      status: 'active'
    });

    // Incrementează numărul de participanți la sesiune
    const sessionRef = doc(db, 'sessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    if (sessionDoc.exists()) {
      const currentParticipants = sessionDoc.data().participanti || 0;
      await updateDoc(sessionRef, {
        participanti: currentParticipants + 1
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Eroare la înscrierea la sesiune:', error);
    return { success: false, error: error.message };
  }
};

export const getUserEnrollments = async (userId) => {
  try {
    const q = query(
      collection(db, 'enrollments'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    const enrollments = [];
    
    // Pentru fiecare înregistrare, obține și datele sesiunii
    for (const enrollDoc of querySnapshot.docs) {
      const enrollData = enrollDoc.data();
      const sessionDoc = await getDoc(doc(db, 'sessions', enrollData.sessionId));
      
      if (sessionDoc.exists()) {
        enrollments.push({
          enrollmentId: enrollDoc.id,
          ...enrollData,
          sessionData: {
            id: sessionDoc.id,
            ...sessionDoc.data()
          }
        });
      }
    }
    
    return { success: true, enrollments };
  } catch (error) {
    console.error('Eroare la obținerea înregistrărilor:', error);
    return { success: false, error: error.message };
  }
};

// ===== UTILITY FUNCTIONS =====

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return timestamp.toDate().toLocaleDateString('ro-RO');
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  return timestamp.toDate().toLocaleString('ro-RO');
};