export function renderDashboard(user, data = {}) {

  const {
    balance = 0,
    activeLoan = null,
    score = 65
  } = data;

  return `
    <div class="screen">

      <h1>💸 MicroCash360</h1>
      <p>Hola 👋</p>

      <!-- 💰 BALANCE -->
      <div class="card">
        <h3>Disponible</h3>
        <h2>$${balance.toLocaleString()}</h2>
      </div>

      <!-- 🧠 SCORE -->
      <div class="card">
        <h3>Score financiero</h3>
        <p>${score}/100</p>
      </div>

      <!-- 💳 PRÉSTAMO -->
      ${
        activeLoan
        ? `
        <div class="card">
          <h3>Préstamo activo</h3>
          <p>Total: $${activeLoan.total}</p>
          <p>Cuota: $${activeLoan.installment}</p>
          <button id="viewLoanBtn">Ver detalle</button>
        </div>
        `
        : `
        <div class="card">
          <h3>Solicitar dinero</h3>
          <input id="amount" placeholder="Monto" />
          <button id="simulateBtn">Simular</button>
        </div>
        `
      }

    </div>
  `;
}