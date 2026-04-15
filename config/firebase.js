console.log("🔥 FIREBASE CARGADO");
// ========================================
// MICROCASH360 - FIREBASE CONFIG PRO
// ========================================

// 🔥 IMPORTS FIREBASE (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getAuth, 
  signInWithPhoneNumber, 
  RecaptchaVerifier 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 CONFIG REAL
const firebaseConfig = {
  apiKey: "AIzaSyCS9blfYpQTzOkKKondQjGmwC0mEqWMZGQ",
  authDomain: "microcash360.firebaseapp.com",
  projectId: "microcash360",
  storageBucket: "microcash360.firebasestorage.app",
  messagingSenderId: "605473385081",
  appId: "1:605473385081:web:54453aa4fd563eca0842a8"
};

// 🚀 INIT APP
const app = initializeApp(firebaseConfig);

// 🔐 AUTH
export const auth = getAuth(app);

// 🗄️ FIRESTORE
export const db = getFirestore(app);

// 📦 EXPORTS CENTRALIZADOS
export {
  // AUTH
  signInWithPhoneNumber,
  RecaptchaVerifier,

  // FIRESTORE
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where
};