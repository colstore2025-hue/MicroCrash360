export function renderDashboard(user) {
  return `
    <div class="screen">
      <h2>Hola ${user.name}</h2>
      <p>¿Necesitas dinero hoy?</p>
      <input type="range" id="amount" min="100000" max="2000000"/>
      <button id="simulateBtn">Simular</button>
    </div>
  `;
}