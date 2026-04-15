console.log("🔥 APP INICIANDO");

// ========================================
// MICROCASH360 - APP CONTROLLER PRO FINAL
// ========================================

// IMPORTS
import { AuthService } from "./auth/authService.js";
import { LoanEngine } from "./loans/loanEngine.js";
import { PaymentService } from "./payments/paymentService.js";

import { renderLogin } from "./ui/loginUI.js";
import { renderOTP } from "./ui/otpUI.js";
import { renderDashboard } from "./ui/dashboardUI.js";
import { renderSimulation } from "./ui/simulationUI.js";

import { render } from "./core/router.js";

// DEBUG
console.log("🚀 MicroCash360 iniciando...");

// INSTANCIAS
const auth = new AuthService();
const loanEngine = new LoanEngine();
const paymentService = new PaymentService();

// ESTADO GLOBAL
let currentUser = null;
let currentLoan = null;

// INIT
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  if (!app) {
    console.error("❌ No existe #app");
    return;
  }

  console.log("✅ UI montada");

  render(app, renderLogin());

  // ========================================
  // EVENTOS
  // ========================================

  document.addEventListener("click", async (e) => {

    // =========================
    // LOGIN → ENVÍA SMS
    // =========================
    if (e.target.id === "loginBtn") {
      try {
        const phone = document.getElementById("phone").value;

        if (!phone) {
          alert("Ingresa número");
          return;
        }

        await auth.login(phone);

        console.log("📩 SMS enviado");

        // 👉 IR A OTP
        render(app, renderOTP());

      } catch (err) {
        console.error(err);
        alert("Error enviando SMS: " + err.message);
      }
    }

    // =========================
    // VERIFICAR OTP
    // =========================
    if (e.target.id === "verifyBtn") {
      try {
        const code = document.getElementById("otp").value;

        currentUser = await auth.verifyOTP(code);

        console.log("✅ Usuario autenticado:", currentUser);

        // 🔥 Cargar préstamos
        const loans = await paymentService.getUserLoans(currentUser.uid);

        if (loans.length > 0) {
          currentLoan = loans[0];
          showLoanDetail(app, currentLoan);
        } else {
          render(app, renderDashboard(currentUser));
        }

      } catch (err) {
        console.error(err);
        alert("Código incorrecto");
      }
    }

    // =========================
    // VOLVER
    // =========================
    if (e.target.id === "backBtn") {
      render(app, renderLogin());
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
        console.error(err);
        alert(err.message);
      }
    }

    // =========================
    // SOLICITAR PRÉSTAMO
    // =========================
    if (e.target.id === "requestBtn") {
      try {
        if (!currentUser || !currentLoan) {
          alert("Datos incompletos");
          return;
        }

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

        const loan = await paymentService.createLoan(
          currentUser.uid,
          currentLoan
        );

        currentLoan = loan;

        showLoanDetail(app, loan);

      } catch (err) {
        console.error(err);
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

        currentLoan.installments = updatedInstallments;

        showLoanDetail(app, currentLoan);

      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }

  });

});

// ========================================
// DETALLE PRÉSTAMO
// ========================================

function showLoanDetail(app, loan) {

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