import type { Inputs } from '../lib/calculations';

interface Props {
  inputs: Inputs;
  currency: string;
  onChange: (next: Inputs) => void;
  onCurrencyChange: (c: string) => void;
}

interface FieldProps {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (n: number) => void;
  testId: string;
}

function Field({ label, hint, value, min, max, step, prefix, suffix, onChange, testId }: FieldProps) {
  const commit = (raw: string) => {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.min(max, Math.max(min, parsed));
    onChange(clamped);
  };

  return (
    <div className="input-row">
      <div className="input-head">
        <label htmlFor={testId}>{label}</label>

        <div className="input-box">
          {prefix && <span className="prefix">{prefix}</span>}
          <input
            id={testId}
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => commit(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            data-testid={testId}
          />
          {suffix && <span className="suffix">{suffix}</span>}
        </div>
      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} slider`}
      />

      <p className="hint">{hint}</p>
    </div>
  );
}

export default function InputPanel({ inputs, currency, onChange, onCurrencyChange }: Props) {
  const set = (key: keyof Inputs) => (n: number) => onChange({ ...inputs, [key]: n });

  return (
    <div className="card">
      <div className="card-head">
        <h2>Your numbers</h2>
        <div className="currency-row">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            data-testid="currency"
          >
            <option>KES</option>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>
      </div>

      <Field
        label="Selling price per item"
        hint="What a customer pays you for one item."
        value={inputs.price}
        min={1}
        max={2000}
        step={1}
        prefix={currency}
        onChange={set('price')}
        testId="price"
      />

      <Field
        label="Cost per item"
        hint="What you pay to buy or make one item."
        value={inputs.variableCost}
        min={0}
        max={2000}
        step={1}
        prefix={currency}
        onChange={set('variableCost')}
        testId="variableCost"
      />

      <Field
        label="Monthly fixed costs"
        hint="Rent, salaries and bills you pay every month, even if you sell nothing."
        value={inputs.fixedCosts}
        min={0}
        max={500000}
        step={1000}
        prefix={currency}
        onChange={set('fixedCosts')}
        testId="fixedCosts"
      />

      <Field
        label="Items sold per month"
        hint="An average month of sales."
        value={inputs.volume}
        min={0}
        max={20000}
        step={50}
        suffix="items"
        onChange={set('volume')}
        testId="volume"
      />

      <Field
        label="Monthly sales growth"
        hint="If you sell 5% more every month, enter 5."
        value={inputs.growthRate}
        min={-20}
        max={50}
        step={1}
        suffix="%"
        onChange={set('growthRate')}
        testId="growthRate"
      />
    </div>
  );
}
