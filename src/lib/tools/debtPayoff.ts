export interface Debt {
  id: string;
  name: string;
  balance: number;
  annualRatePercent: number;
  minPayment: number;
}

export interface PayoffResult {
  months: number;
  totalInterest: number;
  payoffOrder: string[];
}

const MAX_MONTHS = 600;

/**
 * Simula la amortización de una lista de deudas con un extra mensual fijo
 * que se destina siempre a la deuda "prioritaria" según el método elegido
 * (avalancha: mayor interés primero; bola de nieve: menor saldo primero).
 * Cuando una deuda se salda, su pago mínimo se suma al extra disponible.
 */
export function simulatePayoff(
  debts: Debt[],
  extraPerMonth: number,
  method: "avalanche" | "snowball",
): PayoffResult {
  const balances = new Map(debts.map((d) => [d.id, d.balance]));
  const order = [...debts].sort((a, b) =>
    method === "avalanche"
      ? b.annualRatePercent - a.annualRatePercent
      : a.balance - b.balance,
  );
  const payoffOrder: string[] = [];

  let totalInterest = 0;
  let month = 0;
  let freedUpPayment = 0;

  while (month < MAX_MONTHS && [...balances.values()].some((b) => b > 0.01)) {
    month += 1;
    let availableExtra = extraPerMonth + freedUpPayment;

    for (const debt of order) {
      const balance = balances.get(debt.id) ?? 0;
      if (balance <= 0.01) continue;

      const monthlyRate = debt.annualRatePercent / 100 / 12;
      const interest = balance * monthlyRate;
      totalInterest += interest;

      let payment = debt.minPayment;
      if (order.find((d) => (balances.get(d.id) ?? 0) > 0.01)?.id === debt.id) {
        payment += availableExtra;
        availableExtra = 0;
      }

      const newBalance = balance + interest - payment;
      if (newBalance <= 0.01) {
        balances.set(debt.id, 0);
        if (!payoffOrder.includes(debt.id)) {
          payoffOrder.push(debt.id);
          freedUpPayment += debt.minPayment;
        }
      } else {
        balances.set(debt.id, newBalance);
      }
    }
  }

  return { months: month, totalInterest, payoffOrder };
}
