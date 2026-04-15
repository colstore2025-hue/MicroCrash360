export function renderOTP() {
  return `
    <div class="screen">
      <h2>🔐 Verificación</h2>
      <p>Ingresa el código SMS</p>

      <input id="otp" placeholder="123456" />

      <button id="verifyBtn">Verificar</button>

      <button id="backBtn" class="button-secondary">Volver</button>
    </div>
  `;
}