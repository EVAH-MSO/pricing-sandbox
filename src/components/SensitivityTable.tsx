import type { GridCell } from '../lib/calculations';
import { formatMoney } from '../lib/calculations';

interface Props {
  grid: GridCell[][];
  currency: string;
}

export default function SensitivityTable({ grid, currency }: Props) {
  const volumeSteps = grid[0].map((c) => c.volumeChange);

  return (
    <section className="panel">
      <h2>Sensitivity — monthly profit</h2>
      <p className="panel-note">
        Rows: price change. Columns: volume change. Green is profitable, red is a loss.
      </p>
      <div className="table-wrap">
        <table className="sens-table" data-testid="sensitivity-table">
          <thead>
            <tr>
              <th className="corner">Price ↓ / Vol →</th>
              {volumeSteps.map((v) => (
                <th key={v}>{v > 0 ? `+${v}%` : `${v}%`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                <th>{row[0].priceChange > 0 ? `+${row[0].priceChange}%` : `${row[0].priceChange}%`}</th>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={
                      cell.priceChange === 0 && cell.volumeChange === 0
                        ? 'cell-base'
                        : cell.profit >= 0
                        ? 'cell-good'
                        : 'cell-bad'
                    }
                  >
                    {formatMoney(cell.profit, currency)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
