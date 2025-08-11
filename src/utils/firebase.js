// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyB4Um5V80UDMhJOxO-OfgiMt-cGmFArhLA",
  authDomain: "swiftship-3b2e7.firebaseapp.com",
  projectId: "swiftship-3b2e7",
  storageBucket: "swiftship-3b2e7.firebasestorage.app",
  messagingSenderId: "679545932117",
  appId: "1:679545932117:web:7f987a3d467de2bfcec7dc",
  measurementId: "G-J1SJHM63R5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
