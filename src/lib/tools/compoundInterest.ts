export interface ProjectionPoint {
  year: number;
  value: number;
  contributed: number;
}

/**
 * Proyección de interés compuesto con aportación periódica constante.
 * Interés capitalizado mensualmente.
 */
export function projectCompoundGrowth(
  initialAmount: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number,
): ProjectionPoint[] {
  const monthlyRate = annualRatePercent / 100 / 12;
  const points: ProjectionPoint[] = [
    { year: 0, value: initialAmount, contributed: initialAmount },
  ];

  let value = initialAmount;
  let contributed = initialAmount;

  for (let month = 1; month <= years * 12; month += 1) {
    value = value * (1 + monthlyRate) + monthlyContribution;
    contributed += monthlyContribution;

    if (month % 12 === 0) {
      points.push({ year: month / 12, value, contributed });
    }
  }

  return points;
}
