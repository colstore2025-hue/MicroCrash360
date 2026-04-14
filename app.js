// ========================================
// MICROCASH360 - APP CONTROLLER PRO FINAL
// ========================================

// IMPORTS
import { AuthService } from "./auth/authService.js";
import { LoanEngine } from "./loans/loanEngine.js";
import { PaymentService } from "./payments/paymentService.js";

import { renderLogin } from "./ui/loginUI.js";
import { renderDashboard } from "./ui/dashboardUI.js";
import { renderSimulation } from "./ui/simulationUI.js";

import { render } from "./core/router.js";

// INSTANCIAS
const app = document.getElementById("app");

const auth = new AuthService();
const loanEngine = new LoanEngine();
const paymentService = new PaymentService();

// ESTADO GLOBAL
let currentUser = null;
let currentLoan = null;

// INIT
render(app, renderLogin());

// ========================================
// EVENTOS PRINCIPALES
// ========================================

document.addEventListener("click", async (e) => {

  // =========================
  // LOGIN
  // =========================
  if (e.target.id === "loginBtn") {
    try {
      const phone = document.getElementById("phone").value;

      await auth.login(phone);

      // ⚠️ Aquí deberías pedir el OTP real en UI
      currentUser = await auth.verifyOTP("0000");

      // 🔥 Cargar préstamos del usuario
      const loans = await paymentService.getUserLoans(currentUser.uid);

      if (loans.length > 0) {
        currentLoan = loans[0];
        showLoanDetail(currentLoan);
      } else {
        render(app, renderDashboard(currentUser));
      }

    } catch (err) {
      alert("Error en login: " + err.message);
    }
  }

  // =========================
  // SIMULAR PRÉSTAMO
  // =========================
  if (e.target.id === "simulateBtn") {
    try {
      const amount = Number(document.getElementById("amount").value);

      const result = loanEngine.calculateLoan(amount, 10);

      currentLoan = result;

      render(app, renderSimulation(result));

    } catch (err) {
      alert(err.message);
    }
  }

  // =========================
  // SOLICITAR PRÉSTAMO
  // =========================
  if (e.target.id === "requestBtn") {
    try {
      const approval = loanEngine.approveLoan(
        {
          history: "good",
          income: 1200000,
          age: 30,
          loansCount: 1
        },
        currentLoan.amount
      );

      if (!approval.approved) {
        app.innerHTML = `<h1>❌ Crédito rechazado</h1>`;
        return;
      }

      // 🔥 Crear préstamo en Firebase
      const loan = await paymentService.createLoan(
        currentUser.uid,
        currentLoan
      );

      currentLoan = loan;

      showLoanDetail(loan);

    } catch (err) {
      alert("Error al crear préstamo: " + err.message);
    }
  }

  // =========================
  // PAGAR CUOTA
  // =========================
  if (e.target.dataset.pay) {
    try {
      const installmentNumber = Number(e.target.dataset.pay);

      const updatedInstallments = await paymentService.payInstallment(
        currentLoan.id,
        installmentNumber
      );

      // actualizar local
      currentLoan.installments = updatedInstallments;

      showLoanDetail(currentLoan);

    } catch (err) {
      alert(err.message);
    }
  }

});

// ========================================
// UI DETALLE DE PRÉSTAMO
// ========================================

function showLoanDetail(loan) {

  const summary = paymentService.getLoanSummary(loan);

  const installmentsHTML = loan.installments.map(inst => `
    <div style="margin-bottom:10px; padding:10px; background:#111; border-radius:10px;">
      <p><strong>Cuota #${inst.number}</strong></p>
      <p>Valor: $${inst.amount}</p>
      <p>Estado: ${inst.status}</p>
      ${
        inst.status !== "paid"
          ? `<button data-pay="${inst.number}">Pagar</button>`
          : `<span>✔ Pagado</span>`
      }
    </div>
  `).join("");

  app.innerHTML = `
    <div class="screen">
      <h2>💳 Préstamo activo</h2>

      <p>Total: $${summary.total}</p>
      <p>Pagado: $${summary.paid}</p>
      <p>Pendiente: $${summary.pending}</p>
      <p>Estado: ${summary.status}</p>

      <hr>

      <h3>📅 Cuotas</h3>
      ${installmentsHTML}

      <br>
      <button onclick="location.reload()">Volver</button>
    </div>
  `;
}

// ========================================
// (OPCIONAL) LOOP DE COBRANZA FUTURO
// ========================================

// ⚠️ Desactivado porque ahora usas Firebase
// Esto luego va en backend (Node.js / Cloud Functions)

/*
setInterval(() => {
  paymentService.checkLatePayments();

  const actions = paymentService.getCollectionActions();

  if (actions.length > 0) {
    console.log("⚠️ Acciones de cobranza:", actions);
  }
}, 5000);
*/