import type { Inputs, Results } from '../lib/calculations';
import { calculateResults, formatMoney, formatPct } from '../lib/calculations';

export interface Scenario {
  name: string;
  inputs: Inputs;
}

interface Props {
  current: Inputs;
  scenarios: Scenario[];
  currency: string;
  onSave: () => void;
  onClear: () => void;
}

function summary(i: Inputs, currency: string, results: Results): string[] {
  return [
    formatMoney(i.price, currency),
    formatMoney(i.variableCost, currency),
    formatMoney(i.fixedCosts, currency),
    i.volume.toLocaleString(),
    isFinite(results.breakEvenUnits) ? Math.ceil(results.breakEvenUnits).toLocaleString() : '—',
    formatPct(results.contributionMarginPct),
    formatMoney(results.operatingProfit, currency),
  ];
}

const ROWS = [
  'Price',
  'Variable cost',
  'Fixed costs',
  'Volume',
  'Break-even units',
  'Contribution margin',
  'Operating profit',
];

export default function ScenarioCompare({ current, scenarios, currency, onSave, onClear }: Props) {
  const currentRow = summary(current, currency, calculateResults(current));

  return (
    <section className="panel">
      <div className="scenario-head">
        <h2>Scenario compare</h2>
        <div className="scenario-actions">
          <button onClick={onSave} data-testid="save-scenario">Save current</button>
          {scenarios.length > 0 && (
            <button onClick={onClear} className="btn-ghost" data-testid="clear-scenarios">Clear</button>
          )}
        </div>
      </div>

      {scenarios.length === 0 ? (
        <p className="panel-note">
          Set your inputs, then press <strong>Save current</strong> to snapshot a scenario. Change the inputs and save again to compare.
        </p>
      ) : (
        <div className="table-wrap">
          <table className="compare-table" data-testid="compare-table">
            <thead>
              <tr>
                <th></th>
                <th>Current</th>
                {scenarios.map((s, i) => (
                  <th key={i}>{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((label, rowIdx) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{currentRow[rowIdx]}</td>
                  {scenarios.map((s, i) => (
                    <td key={i}>{summary(s.inputs, currency, calculateResults(s.inputs))[rowIdx]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
