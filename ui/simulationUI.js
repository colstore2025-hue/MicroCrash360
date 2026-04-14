export function renderSimulation(data) {
  return `
    <div class="screen">
      <h2>Simulación</h2>
      <p>Monto: ${data.amount}</p>
      <p>Total: ${data.total}</p>
      <p>Cuota semanal: ${data.weekly}</p>
      <button id="requestBtn">Solicitar</button>
    </div>
  `;
}