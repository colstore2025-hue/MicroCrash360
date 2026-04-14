// ========================================
// MICROCASH360 - PAYMENT SERVICE FIREBASE
// ========================================

import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc 
} from "../config/firebase.js";

export class PaymentService {

  // ========================================
  // 📌 CREAR CUOTAS
  // ========================================
  createInstallments(loanId, amount, weeks) {
    const installments = [];
    const weeklyAmount = Math.ceil(amount / weeks);

    for (let i = 0; i < weeks; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (7 * (i + 1)));

      installments.push({
        number: i + 1,
        amount: weeklyAmount,
        dueDate: dueDate.toISOString(),
        status: "pending",
        paidAt: null
      });
    }

    return installments;
  }

  // ========================================
  // 💾 CREAR PRÉSTAMO EN FIREBASE
  // ========================================
  async createLoan(userId, loanData) {

    const installments = this.createInstallments(
      "temp",
      loanData.total,
      loanData.weeks
    );

    const loan = {
      userId,
      amount: loanData.amount,
      total: loanData.total,
      weeks: loanData.weeks,
      installments,
      status: "active",
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "loans"), loan);

    return {
      id: docRef.id,
      ...loan
    };
  }

  // ========================================
  // 📥 OBTENER PRÉSTAMOS POR USUARIO
  // ========================================
  async getUserLoans(userId) {
    const snapshot = await getDocs(collection(db, "loans"));

    const loans = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();

      if (data.userId === userId) {
        loans.push({
          id: docSnap.id,
          ...data
        });
      }
    });

    return loans;
  }

  // ========================================
  // 💵 PAGAR CUOTA
  // ========================================
  async payInstallment(loanId, installmentNumber) {

    const loansSnapshot = await getDocs(collection(db, "loans"));

    let loanDoc = null;
    let loanData = null;

    loansSnapshot.forEach(docSnap => {
      if (docSnap.id === loanId) {
        loanDoc = docSnap.ref;
        loanData = docSnap.data();
      }
    });

    if (!loanDoc) throw new Error("Préstamo no encontrado");

    const installments = loanData.installments.map(inst => {
      if (inst.number === installmentNumber && inst.status !== "paid") {
        return {
          ...inst,
          status: "paid",
          paidAt: new Date().toISOString()
        };
      }
      return inst;
    });

    await updateDoc(loanDoc, { installments });

    return installments;
  }

  // ========================================
  // 📊 RESUMEN
  // ========================================
  getLoanSummary(loan) {

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
}