export class LoanEngine {
  calculateLoan(amount, weeks) {
    const interest = 0.2;
    const total = amount + amount * interest;
    const weekly = total / weeks;

    return { amount, total, weekly, weeks };
  }

  approveLoan() {
    return Math.random() > 0.3;
  }
}