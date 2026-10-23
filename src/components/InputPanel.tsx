import type { Inputs } from '../lib/calculations';

interface Props {
  inputs: Inputs;
  currency: string;
  onChange: (next: Inputs) => void;
  onCurrencyChange: (c: string) => void;
}

interface FieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (n: number) => void;
  testId: string;
}

function Field({ label, value, min, max, step, suffix, onChange, testId }: FieldProps) {
  return (
    <div className="field">
      <div className="field-head">
        <label>{label}</label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          data-testid={testId}
        />
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      {suffix && <span className="field-suffix">{suffix}</span>}
    </div>
  );
}

export default function InputPanel({ inputs, currency, onChange, onCurrencyChange }: Props) {
  const set = (key: keyof Inputs) => (n: number) => onChange({ ...inputs, [key]: n });

  return (
    <aside className="panel input-panel">
      <h2>Inputs</h2>

      <div className="field">
        <div className="field-head">
          <label>Currency</label>
          <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)} data-testid="currency">
            <option>KES</option>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>
      </div>

      <Field label="Unit price" value={inputs.price} min={1} max={2000} step={1}
             onChange={set('price')} testId="price" />
      <Field label="Variable cost per unit" value={inputs.variableCost} min={0} max={2000} step={1}
             onChange={set('variableCost')} testId="variableCost" />
      <Field label="Fixed costs (monthly)" value={inputs.fixedCosts} min={0} max={500000} step={1000}
             onChange={set('fixedCosts')} testId="fixedCosts" />
      <Field label="Expected volume (units/month)" value={inputs.volume} min={0} max={20000} step={50}
             onChange={set('volume')} testId="volume" />
      <Field label="Monthly volume growth" value={inputs.growthRate} min={-20} max={50} step={1}
             suffix="%" onChange={set('growthRate')} testId="growthRate" />

      <p className="panel-note">
        Contribution margin = price − variable cost. Break-even = fixed costs ÷ contribution margin.
      </p>
    </aside>
  );
}
