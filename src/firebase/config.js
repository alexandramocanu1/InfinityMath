import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBJ-V5XqbcFXRn7wdO_iTbLxsbXZpp0zOM", 
  authDomain: "infinity-math-53be3.firebaseapp.com",
  projectId: "infinity-math-53be3",
  storageBucket: "infinity-math-53be3.firebasestorage.app",
  messagingSenderId: "298237929876",
  appId: "1:298237929876:web:9f48511cad9d0b9453c781" 
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;