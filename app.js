// ===============================
// MICROCASH360 - APP CONTROLLER PRO
// ===============================

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

// ESTADO GLOBAL (MVP)
let currentUser = null;
let currentLoan = null;

// INIT
render(app, renderLogin());

// ===============================
// EVENTOS PRINCIPALES
// ===============================

document.addEventListener("click", async (e) => {

  // =========================
  // LOGIN
  // =========================
  if (e.target.id === "loginBtn") {
    const phone = document.getElementById("phone").value;

    await auth.login(phone);
    currentUser = await auth.verifyOTP("0000");

    render(app, renderDashboard(currentUser));
  }

  // =========================
  // SIMULAR PRÉSTAMO
  // =========================
  if (e.target.id === "simulateBtn") {
    const amount = Number(document.getElementById("amount").value);

    try {
      const result = loanEngine.calculateLoan(amount, 10);

      // Guardamos temporal
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

    const approval = loanEngine.approveLoan({
      history: "good",
      income: 1200000
    });

    if (!approval.approved) {
      app.innerHTML = `<h1>❌ Crédito rechazado</h1>`;
      return;
    }

    // Crear préstamo real con cuotas
    const loan = paymentService.createLoan(currentUser.id, currentLoan);

    currentLoan = loan;

    showLoanDetail(loan);
  }

  // =========================
  // PAGAR CUOTA
  // =========================
  if (e.target.dataset.pay) {
    const installmentNumber = Number(e.target.dataset.pay);

    try {
      paymentService.payInstallment(currentLoan.id, installmentNumber);

      showLoanDetail(currentLoan);

    } catch (err) {
      alert(err.message);
    }
  }

});

// ===============================
// UI DETALLE DE PRÉSTAMO
// ===============================

function showLoanDetail(loan) {
  const summary = paymentService.getLoanSummary(loan.id);

  const installmentsHTML = loan.installments.map(inst => `
    <div style="margin-bottom:10px; padding:10px; background:#111;">
      <p>Cuota #${inst.number}</p>
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
      <h2>Préstamo activo</h2>

      <p>Total: $${summary.total}</p>
      <p>Pagado: $${summary.paid}</p>
      <p>Pendiente: $${summary.pending}</p>
      <p>Estado: ${summary.status}</p>

      <hr>

      <h3>Cuotas</h3>
      ${installmentsHTML}

      <br>
      <button onclick="location.reload()">Volver</button>
    </div>
  `;
}

// ===============================
// LOOP DE COBRANZA (SIMULACIÓN)
// ===============================

// Cada 5 segundos revisa mora
setInterval(() => {
  paymentService.checkLatePayments();

  const actions = paymentService.getCollectionActions();

  if (actions.length > 0) {
    console.log("⚠️ Acciones de cobranza:", actions);
  }

}, 5000);