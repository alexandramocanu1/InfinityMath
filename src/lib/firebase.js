// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ-V5XqbcFXRn7wdO_iTbLxsbXZpp0zOM",
  authDomain: "infinity-math-53be3.firebaseapp.com",
  projectId: "infinity-math-53be3",
  storageBucket: "infinity-math-53be3.firebasestorage.app",
  messagingSenderId: "298237929876",
  appId: "1:298237929876:web:9f48511cad9d0b9453c781",
  measurementId: "G-E2V65M6271"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);