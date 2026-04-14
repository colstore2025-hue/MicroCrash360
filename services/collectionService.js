import { db } from "../firebaseAdmin.js";

export class CollectionService {

  async checkLatePayments() {
    const snapshot = await db.collection("loans").get();

    const actions = [];

    snapshot.forEach(doc => {
      const loan = doc.data();
      const loanId = doc.id;

      loan.installments.forEach(inst => {
        const dueDate = new Date(inst.dueDate);
        const now = new Date();

        if (inst.status === "pending" && dueDate < now) {
          inst.status = "late";

          actions.push({
            loanId,
            userId: loan.userId,
            installment: inst.number,
            message: `Tienes una cuota vencida (#${inst.number})`
          });
        }
      });

      // actualizar en Firebase
      db.collection("loans").doc(loanId).update({
        installments: loan.installments
      });
    });

    return actions;
  }

}