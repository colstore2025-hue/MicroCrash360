export class AuthService {
  constructor() {
    this.user = null;
  }

  async login(phone) {
    console.log("OTP enviado a", phone);
    return true;
  }

  async verifyOTP(code) {
    this.user = {
      id: Date.now(),
      name: "Usuario",
    };
    return this.user;
  }

  getUser() {
    return this.user;
  }
}
