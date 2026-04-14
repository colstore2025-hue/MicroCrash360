// ===============================
// FIREBASE INIT (REAL)
// ===============================

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
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 TU CONFIG REAL
const firebaseConfig = {
  apiKey: "AIzaSyCS9blfYpQTzOkKKondQjGmwC0mEqWMZGQ",
  authDomain: "microcash360.firebaseapp.com",
  projectId: "microcash360",
  storageBucket: "microcash360.firebasestorage.app",
  messagingSenderId: "605473385081",
  appId: "1:605473385081:web:54453aa4fd563eca0842a8"
};

// INIT
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// EXPORTS
export {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
};