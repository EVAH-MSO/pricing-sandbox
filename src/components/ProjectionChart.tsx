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
    <section className="panel">
      <h2>12-month projection</h2>
      <p className="panel-note">
        Volume grows at the rate you set; fixed costs stay constant.
      </p>
      <div className="chart-wrap" data-testid="projection-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid stroke="#e6e8eb" strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(m) => `M${m}`} />
            <YAxis tickFormatter={(v) => new Intl.NumberFormat('en', { notation: 'compact' }).format(v)} />
            <Tooltip formatter={(v: number) => formatMoney(v, currency)} labelFormatter={(m) => `Month ${m}`} />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#1f6feb" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="profit" name="Profit" stroke="#0f9d58" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
