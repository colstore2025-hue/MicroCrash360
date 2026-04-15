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
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
    }
  }

  async login(phone) {
    if (!phone) throw new Error("Ingresa un número");

    phone = phone.replace(/\D/g, "");

    if (phone.length !== 10) {
      throw new Error("Número inválido");
    }

    this.setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;

    this.confirmationResult = await signInWithPhoneNumber(
      auth,
      "+57" + phone,
      appVerifier
    );

    return true;
  }

  async verifyOTP(code) {
    if (!this.confirmationResult) {
      throw new Error("Primero solicita el código");
    }

    if (!code || code.length < 6) {
      throw new Error("Código inválido");
    }

    const result = await this.confirmationResult.confirm(code);

    return result.user;
  }
}