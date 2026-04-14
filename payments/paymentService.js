export class PaymentService {
  pay(amount) {
    console.log("Pago realizado:", amount);
    return { status: "ok" };
  }
}