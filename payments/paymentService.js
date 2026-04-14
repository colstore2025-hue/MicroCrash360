// ========================================
// MICROCASH360 - PAYMENT & COLLECTION ENGINE
// ========================================

export class PaymentService {
  constructor() {
    this.loans = []; // base temporal (luego va a Firebase)
  }

  // 📌 Crear plan de pagos (cuotas)
  createInstallments(loanId, amount, weeks, startDate = new Date()) {
    const installments = [];
    const weeklyAmount = Math.ceil(amount / weeks);

    for (let i = 0; i < weeks; i++) {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + (7 * (i + 1)));

      installments.push({
        id: `${loanId}-${i + 1}`,
        number: i + 1,
        amount: weeklyAmount,
        dueDate: dueDate.toISOString(),
        status: "pending", // pending | paid | late
        paidAt: null
      });
    }

    return installments;
  }

  // 💾 Crear préstamo con cuotas
  createLoan(userId, loanData) {
    const loanId = "loan-" + Date.now();

    const installments = this.createInstallments(
      loanId,
      loanData.total,
      loanData.weeks
    );

    const loan = {
      id: loanId,
      userId,
      amount: loanData.amount,
      total: loanData.total,
      weeks: loanData.weeks,
      installments,
      status: "active", // active | completed | default
      createdAt: new Date().toISOString()
    };

    this.loans.push(loan);

    return loan;
  }

  // 💵 Registrar pago
  payInstallment(loanId, installmentNumber) {
    const loan = this.loans.find(l => l.id === loanId);

    if (!loan) throw new Error("Préstamo no encontrado");

    const installment = loan.installments.find(
      i => i.number === installmentNumber
    );

    if (!installment) throw new Error("Cuota no encontrada");

    if (installment.status === "paid") {
      throw new Error("Cuota ya pagada");
    }

    installment.status = "paid";
    installment.paidAt = new Date().toISOString();

    this.updateLoanStatus(loan);

    return installment;
  }

  // 🔄 Actualizar estado del préstamo
  updateLoanStatus(loan) {
    const pending = loan.installments.filter(i => i.status !== "paid");

    if (pending.length === 0) {
      loan.status = "completed";
    }
  }

  // 🚨 Detectar mora (clave del negocio)
  checkLatePayments() {
    const now = new Date();

    this.loans.forEach(loan => {
      loan.installments.forEach(inst => {
        if (
          inst.status === "pending" &&
          new Date(inst.dueDate) < now
        ) {
          inst.status = "late";
        }
      });
    });
  }

  // 📊 Resumen del préstamo
  getLoanSummary(loanId) {
    const loan = this.loans.find(l => l.id === loanId);

    if (!loan) return null;

    const paid = loan.installments
      .filter(i => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);

    const pending = loan.total - paid;

    return {
      total: loan.total,
      paid,
      pending,
      status: loan.status
    };
  }

  // 🧠 Cobranza inteligente (base)
  getCollectionActions() {
    const actions = [];

    this.loans.forEach(loan => {
      loan.installments.forEach(inst => {
        if (inst.status === "late") {
          actions.push({
            loanId: loan.id,
            installment: inst.number,
            action: "sendReminder", // luego WhatsApp
            message: "Tienes una cuota vencida"
          });
        }
      });
    });

    return actions;
  }
}