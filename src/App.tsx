import { useMemo, useState } from 'react';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import SensitivityTable from './components/SensitivityTable';
import ProjectionChart from './components/ProjectionChart';
import ScenarioCompare, { type Scenario } from './components/ScenarioCompare';
import {
  calculateResults,
  buildSensitivityGrid,
  projectMonths,
  type Inputs,
} from './lib/calculations';
import './App.css';

const DEFAULTS: Inputs = {
  price: 120,
  variableCost: 70,
  fixedCosts: 60000,
  volume: 2000,
  growthRate: 5,
};

export default function App() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [currency, setCurrency] = useState('KES');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const results = useMemo(() => calculateResults(inputs), [inputs]);
  const grid = useMemo(() => buildSensitivityGrid(inputs), [inputs]);
  const projection = useMemo(() => projectMonths(inputs), [inputs]);

  const saveScenario = () => {
    setScenarios((prev) => [
      ...prev.slice(0, 1),
      { name: `Scenario ${prev.length + 1}`, inputs: { ...inputs } },
    ]);
  };

  return (
    <div className="app">
      <header className="app-head">
        <h1>Pricing &amp; Unit Economics Sandbox</h1>
        <p>Enter your costs and prices. See margins, break-even, and sensitivity instantly.</p>
      </header>

      <div className="layout">
        <InputPanel
          inputs={inputs}
          currency={currency}
          onChange={setInputs}
          onCurrencyChange={setCurrency}
        />

        <main className="main">
          <ResultsPanel results={results} currency={currency} />
          <SensitivityTable grid={grid} currency={currency} />
          <ProjectionChart data={projection} currency={currency} />
          <ScenarioCompare
            current={inputs}
            scenarios={scenarios}
            currency={currency}
            onSave={saveScenario}
            onClear={() => setScenarios([])}
          />
        </main>
      </div>

      <footer className="app-foot">
        All calculations run in the browser. Break-even = fixed costs ÷ (price − variable cost).
      </footer>
    </div>
  );
}
