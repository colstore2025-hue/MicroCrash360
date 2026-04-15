// ========================================
// 🔥 MICROCASH360 - FIREBASE CONFIG PRO
// ========================================

console.log("🔥 Inicializando Firebase...");

// ========================================
// 📦 IMPORTS (CDN - COMPATIBLE CON VERCEL)
// ========================================

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

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

// ========================================
// 🔑 CONFIGURACIÓN REAL
// ========================================

const firebaseConfig = {
  apiKey: "AIzaSyCS9blfYpQTzOkKKondQjGmwC0mEqWMZGQ",
  authDomain: "microcash360.firebaseapp.com",
  projectId: "microcash360",
  storageBucket: "microcash360.appspot.com", // 🔥 CORREGIDO
  messagingSenderId: "605473385081",
  appId: "1:605473385081:web:54453aa4fd563eca0842a8"
};

// ========================================
// 🚀 INICIALIZACIÓN SEGURA
// ========================================

let app;

try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase inicializado correctamente");
} catch (err) {
  console.error("❌ Error inicializando Firebase:", err);
}

// ========================================
// 🔐 AUTH
// ========================================

export const auth = getAuth();

// 🔥 IMPORTANTE: fuerza contexto navegador
auth.useDeviceLanguage();

// ========================================
// 🗄️ FIRESTORE
// ========================================

export const db = getFirestore(app);

// ========================================
// 📦 EXPORTS CENTRALIZADOS
// ========================================

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

// ========================================
// 🧪 DEBUG GLOBAL
// ========================================

window.firebaseDebug = {
  app,
  auth,
  db
};

console.log("🔥 Firebase listo para usar");