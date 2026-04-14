// ===============================
// MICROCASH360 - LOAN ENGINE PRO
// ===============================

export class LoanEngine {
  constructor() {
    this.maxAmount = 2000000;
    this.minAmount = 100000;
    this.maxWeeks = 12;
    this.minWeeks = 4;
  }

  // 📊 Calcular préstamo
  calculateLoan(amount, weeks) {
    this.validate(amount, weeks);

    const interestRate = this.getInterestRate(weeks);
    const interest = amount * interestRate;
    const total = amount + interest;
    const installment = Math.ceil(total / weeks);

    return {
      amount,
      interest,
      total,
      weeks,
      installment,
      interestRate
    };
  }

  // 🧠 Tasa dinámica (puedes mejorar con IA)
  getInterestRate(weeks) {
    if (weeks <= 4) return 0.15;
    if (weeks <= 8) return 0.18;
    return 0.22;
  }

  // 🔍 Validaciones reales
  validate(amount, weeks) {
    if (amount < this.minAmount) {
      throw new Error("Monto demasiado bajo");
    }

    if (amount > this.maxAmount) {
      throw new Error("Monto demasiado alto");
    }

    if (weeks < this.minWeeks || weeks > this.maxWeeks) {
      throw new Error("Plazo inválido");
    }
  }

  // 🧠 Evaluación de riesgo (MVP)
  evaluateRisk(user) {
    let score = 50;

    if (user.history === "good") score += 30;
    if (user.history === "bad") score -= 30;

    if (user.income > 1000000) score += 10;

    return score;
  }

  // ✅ Aprobación
  approveLoan(user) {
    const score = this.evaluateRisk(user);

    if (score >= 60) {
      return {
        approved: true,
        maxAmount: 1000000
      };
    }

    return {
      approved: false
    };
  }
}