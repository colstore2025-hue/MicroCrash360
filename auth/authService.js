console.log("🔥 AUTH SERVICE CARGADO");
// ========================================
// MICROCASH360 - AUTH SERVICE PRO
// ========================================

import { auth } from "../config/firebase.js";
import { signInWithPhoneNumber, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export class AuthService {
  constructor() {
    this.confirmationResult = null;
    this.recaptchaVerifier = null;
  }

  setupRecaptcha() {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible"
      });
    }
  }

  async login(phone) {
    try {
      this.setupRecaptcha();

      const appVerifier = this.recaptchaVerifier;

      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        "+57" + phone,
        appVerifier
      );

      console.log("✅ OTP enviado");

      return true;

    } catch (error) {
      console.error("❌ Error login:", error);
      throw error;
    }
  }

  async verifyOTP(code) {
    try {
      const result = await this.confirmationResult.confirm(code);

      console.log("✅ Usuario verificado");

      return result.user;

    } catch (error) {
      console.error("❌ Error OTP:", error);
      throw error;
    }
  }
}