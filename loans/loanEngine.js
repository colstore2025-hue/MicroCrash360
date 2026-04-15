// ========================================
// MICROCASH360 - LOAN ENGINE PRO (INTEGRADO)
// ========================================

export class LoanEngine {
  constructor() {
    this.maxAmount = 2000000;
    this.minAmount = 100000;

    this.maxWeeks = 12;
    this.minWeeks = 4;

    this.baseScore = 50;
  }

  // ========================================
  // 📊 CALCULAR PRÉSTAMO
  // ========================================
  calculateLoan(amount, weeks) {
    this.validate(amount, weeks);

    const interestRate = this.getInterestRate(weeks);
    const interest = Math.ceil(amount * interestRate);
    const total = amount + interest;
    const installment = Math.ceil(total / weeks);

    return {
      amount,
      interest,
      total,
      weeks,
      installment,
      interestRate,
      createdAt: new Date().toISOString()
    };
  }

  // ========================================
  // 📈 TASA DINÁMICA
  // ========================================
  getInterestRate(weeks) {
    if (weeks <= 4) return 0.15;
    if (weeks <= 8) return 0.18;
    return 0.22;
  }

  // ========================================
  // 🔍 VALIDACIONES
  // ========================================
  validate(amount, weeks) {
    if (!amount || !weeks) {
      throw new Error("Datos incompletos");
    }

    if (amount < this.minAmount) {
      throw new Error(`Monto mínimo: ${this.minAmount}`);
    }

    if (amount > this.maxAmount) {
      throw new Error(`Monto máximo: ${this.maxAmount}`);
    }

    if (weeks < this.minWeeks || weeks > this.maxWeeks) {
      throw new Error("Plazo inválido");
    }
  }

  // ========================================
  // 🧠 SCORE DE RIESGO (MEJORADO)
  // ========================================
  evaluateRisk(user) {
    let score = this.baseScore;

    // Historial
    if (user.history === "good") score += 30;
    if (user.history === "bad") score -= 40;

    // Ingresos
    if (user.income >= 1000000) score += 10;
    if (user.income < 500000) score -= 10;

    // Edad
    if (user.age >= 25 && user.age <= 55) score += 5;

    // Uso previo
    if (user.loansCount > 3) score += 5;

    return score;
  }

getUserScore(loans = []) {
  let score = 50;

  loans.forEach(loan => {
    const paid = loan.installments.filter(i => i.status === "paid").length;
    const total = loan.installments.length;

    const ratio = paid / total;

    if (ratio > 0.9) score += 20;
    else if (ratio > 0.7) score += 10;
    else score -= 10;
  });

  return Math.max(0, Math.min(100, score));
}

  // ========================================
  // 💰 MONTO MÁXIMO SEGÚN SCORE
  // ========================================
  getMaxAmountByScore(score) {
    if (score >= 80) return 2000000;
    if (score >= 70) return 1500000;
    if (score >= 60) return 1000000;
    if (score >= 50) return 500000;
    return 0;
  }

  // ========================================
  // ✅ APROBACIÓN FINAL (INTEGRADA)
  // ========================================
  approveLoan(user, requestedAmount) {
    if (!requestedAmount) {
      throw new Error("Monto solicitado requerido");
    }

    const score = this.evaluateRisk(user);
    const maxAllowed = this.getMaxAmountByScore(score);

    // ❌ Rechazado
    if (maxAllowed === 0) {
      return {
        approved: false,
        reason: "Riesgo alto",
        score
      };
    }

    // ⚠️ Ajuste automático
    if (requestedAmount > maxAllowed) {
      return {
        approved: true,
        approvedAmount: maxAllowed,
        adjusted: true,
        score,
        message: "Monto ajustado por riesgo"
      };
    }

    // ✅ Aprobado normal
    return {
      approved: true,
      approvedAmount: requestedAmount,
      adjusted: false,
      score
    };
  }

  // ========================================
  // 🧠 PERFIL FINANCIERO (NUEVO PRO)
  // ========================================
  buildUserProfile(user) {
    return {
      history: user.history || "unknown",
      income: user.income || 0,
      age: user.age || 0,
      loansCount: user.loansCount || 0,
      createdAt: new Date().toISOString()
    };
  }

  // ========================================
  // 🧠 HOOK PARA IA FUTURA
  // ========================================
  async evaluateWithAI(user) {
    // Aquí conectarás modelo real (TensorFlow / API externa)
    return this.evaluateRisk(user);
  }
}