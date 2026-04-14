import { AuthService } from "./auth/authService.js";
import { LoanEngine } from "./loans/loanEngine.js";

import { renderLogin } from "./ui/loginUI.js";
import { renderDashboard } from "./ui/dashboardUI.js";
import { renderSimulation } from "./ui/simulationUI.js";

import { render } from "./core/router.js";

const app = document.getElementById("app");

const auth = new AuthService();
const loan = new LoanEngine();

// INIT
render(app, renderLogin());

// LOGIN
document.addEventListener("click", async (e) => {
  if (e.target.id === "loginBtn") {
    const phone = document.getElementById("phone").value;
    await auth.login(phone);
    const user = await auth.verifyOTP("0000");

    render(app, renderDashboard(user));
  }

  if (e.target.id === "simulateBtn") {
    const amount = document.getElementById("amount").value;
    const data = loan.calculateLoan(Number(amount), 10);

    render(app, renderSimulation(data));
  }

  if (e.target.id === "requestBtn") {
    const approved = loan.approveLoan();

    if (approved) {
      app.innerHTML = "<h1>✅ Aprobado</h1>";
    } else {
      app.innerHTML = "<h1>❌ Rechazado</h1>";
    }
  }
});