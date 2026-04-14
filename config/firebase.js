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
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO",
  projectId: "microcash360",
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