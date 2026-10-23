import type { Results } from '../lib/calculations';
import { formatMoney, formatPct } from '../lib/calculations';

interface Props {
  results: Results;
  currency: string;
}

export default function ResultsPanel({ results, currency }: Props) {
  const profitPositive = results.operatingProfit >= 0;

  return (
    <section className="results">
      <div className="stat">
        <span className="stat-label">Contribution / unit</span>
        <strong data-testid="contribution">{formatMoney(results.contributionPerUnit, currency)}</strong>
      </div>
      <div className="stat">
        <span className="stat-label">Contribution margin</span>
        <strong data-testid="margin-pct">{formatPct(results.contributionMarginPct)}</strong>
      </div>
      <div className="stat">
        <span className="stat-label">Break-even units</span>
        <strong data-testid="breakeven-units">
          {isFinite(results.breakEvenUnits) ? Math.ceil(results.breakEvenUnits).toLocaleString() : '—'}
        </strong>
      </div>
      <div className="stat">
        <span className="stat-label">Break-even revenue</span>
        <strong data-testid="breakeven-revenue">
          {isFinite(results.breakEvenRevenue) ? formatMoney(results.breakEvenRevenue, currency) : '—'}
        </strong>
      </div>
      <div className="stat">
        <span className="stat-label">Margin of safety</span>
        <strong data-testid="margin-of-safety">{formatPct(results.marginOfSafetyPct)}</strong>
      </div>
      <div className={`stat ${profitPositive ? 'stat-good' : 'stat-bad'}`}>
        <span className="stat-label">Operating profit</span>
        <strong data-testid="operating-profit">{formatMoney(results.operatingProfit, currency)}</strong>
      </div>
    </section>
  );
}
