export interface Inputs {
  price: number;
  variableCost: number;
  fixedCosts: number;
  volume: number;
  growthRate: number;
}

export interface Results {
  contributionPerUnit: number;
  contributionMarginPct: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  operatingProfit: number;
  marginOfSafetyPct: number;
}

export interface GridCell {
  priceChange: number;
  volumeChange: number;
  profit: number;
}

export interface MonthPoint {
  month: number;
  revenue: number;
  profit: number;
}

export function calculateResults(i: Inputs): Results {
  const contributionPerUnit = i.price - i.variableCost;
  const contributionMarginPct = i.price > 0 ? (contributionPerUnit / i.price) * 100 : 0;
  const breakEvenUnits = contributionPerUnit > 0 ? i.fixedCosts / contributionPerUnit : Infinity;
  const breakEvenRevenue = breakEvenUnits * i.price;
  const operatingProfit = i.volume * contributionPerUnit - i.fixedCosts;
  const marginOfSafetyPct =
    i.volume > 0 && isFinite(breakEvenUnits)
      ? ((i.volume - breakEvenUnits) / i.volume) * 100
      : 0;

  return {
    contributionPerUnit,
    contributionMarginPct,
    breakEvenUnits,
    breakEvenRevenue,
    operatingProfit,
    marginOfSafetyPct,
  };
}

export function buildSensitivityGrid(
  i: Inputs,
  steps: number[] = [-20, -10, 0, 10, 20]
): GridCell[][] {
  return steps.map((priceChange) =>
    steps.map((volumeChange) => {
      const p = i.price * (1 + priceChange / 100);
      const v = i.volume * (1 + volumeChange / 100);
      return {
        priceChange,
        volumeChange,
        profit: v * (p - i.variableCost) - i.fixedCosts,
      };
    })
  );
}

export function projectMonths(i: Inputs, months = 12): MonthPoint[] {
  const g = i.growthRate / 100;
  return Array.from({ length: months }, (_, idx) => {
    const t = idx + 1;
    const vol = i.volume * Math.pow(1 + g, t - 1);
    return {
      month: t,
      revenue: vol * i.price,
      profit: vol * (i.price - i.variableCost) - i.fixedCosts,
    };
  });
}

export function formatMoney(n: number, currency = 'KES'): string {
  if (!isFinite(n)) return '—';
  return `${currency} ${new Intl.NumberFormat('en-KE', {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

export function formatPct(n: number): string {
  if (!isFinite(n)) return '—';
  return `${n.toFixed(1)}%`;
}
