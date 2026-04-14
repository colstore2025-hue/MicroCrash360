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
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible"
    });
  }

  async login(phone) {
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
    const result = await this.confirmationResult.confirm(code);

    return result.user;
  }
}