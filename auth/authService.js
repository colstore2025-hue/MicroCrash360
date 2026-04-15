console.log("AUTH:", auth);
import { 
  auth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "../config/firebase.js";

export class AuthService {
  constructor() {
    this.confirmationResult = null;
  }

  setupRecaptcha() {
    if (!window.recaptchaVerifier) {

      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container", // 🔥 PRIMERO EL ID
        {
          size: "invisible",
          callback: () => {
            console.log("✅ reCAPTCHA resuelto");
          }
        },
        auth // 🔥 AUTH VA AL FINAL
      );

      window.recaptchaVerifier.render();
    }
  }

  async login(phone) {
    if (!phone || phone.length < 10) {
      throw new Error("Número inválido");
    }

    this.setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;

    const fullPhone = "+57" + phone;

    console.log("📞 Enviando SMS a:", fullPhone);

    this.confirmationResult = await signInWithPhoneNumber(
      auth,
      fullPhone,
      appVerifier
    );

    return true;
  }

  async verifyOTP(code) {
    if (!this.confirmationResult) {
      throw new Error("No se ha enviado el código");
    }

    const result = await this.confirmationResult.confirm(code);

    return result.user;
  }
}