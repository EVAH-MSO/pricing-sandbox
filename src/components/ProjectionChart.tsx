import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { MonthPoint } from '../lib/calculations';
import { formatMoney } from '../lib/calculations';

interface Props {
  data: MonthPoint[];
  currency: string;
}

export default function ProjectionChart({ data, currency }: Props) {
  return (
    <div className="card">
      <h2>Your next 12 months</h2>
      <p className="hint" style={{ marginBottom: 16 }}>
        Revenue and profit if your sales keep growing at the rate you set.
      </p>
      <div className="chart-wrap" data-testid="projection-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(m) => `M${m}`} />
            <YAxis tickFormatter={(v) => new Intl.NumberFormat('en', { notation: 'compact' }).format(Number(v))} />
            <Tooltip
              formatter={(value) => formatMoney(Number(value), currency)}
              labelFormatter={(m) => `Month ${m}`}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="profit" name="Profit" stroke="#16a34a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
