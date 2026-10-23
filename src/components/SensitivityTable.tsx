import type { GridCell } from '../lib/calculations';
import { formatMoney } from '../lib/calculations';

interface Props {
  grid: GridCell[][];
  currency: string;
}

export default function SensitivityTable({ grid, currency }: Props) {
  const volumeSteps = grid[0].map((c) => c.volumeChange);

  return (
    <div className="card">
      <h2>What if I change my price or sell fewer items?</h2>
      <p className="hint" style={{ marginBottom: 16 }}>
        Each box shows your monthly profit if your price and sales change by that amount.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table className="grid-table" data-testid="sensitivity-table">
          <thead>
            <tr>
              <th className="row-head">Price ↓ / Sales →</th>
              {volumeSteps.map((v) => (
                <th key={v}>{v > 0 ? `+${v}%` : `${v}%`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                <th className="row-head">
                  {row[0].priceChange > 0 ? `+${row[0].priceChange}%` : `${row[0].priceChange}%`}
                </th>
                {row.map((cell, c) => {
                  const isBase = cell.priceChange === 0 && cell.volumeChange === 0;
                  return (
                    <td
                      key={c}
                      className={isBase ? 'base' : cell.profit >= 0 ? 'good' : 'bad'}
                    >
                      {formatMoney(cell.profit, currency)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid-legend">
        <span><span className="legend-dot blue"></span>Your current situation</span>
        <span><span className="legend-dot green"></span>You make money</span>
        <span><span className="legend-dot red"></span>You lose money</span>
      </div>
    </div>
  );
}
