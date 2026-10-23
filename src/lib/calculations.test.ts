import { describe, it, expect } from 'vitest';
import { calculateResults, buildSensitivityGrid, projectMonths } from './calculations';

describe('calculateResults — known-answer fixtures', () => {
  it('case A: standard positive-margin business', () => {
    const r = calculateResults({ price: 100, variableCost: 60, fixedCosts: 40000, volume: 1500, growthRate: 5 });
    expect(r.contributionPerUnit).toBe(40);
    expect(r.contributionMarginPct).toBeCloseTo(40);
    expect(r.breakEvenUnits).toBe(1000);
    expect(r.breakEvenRevenue).toBe(100000);
    expect(r.operatingProfit).toBe(20000);
    expect(r.marginOfSafetyPct).toBeCloseTo(33.33, 1);
  });

  it('case B: higher price, higher fixed cost', () => {
    const r = calculateResults({ price: 250, variableCost: 100, fixedCosts: 90000, volume: 800, growthRate: 0 });
    expect(r.contributionPerUnit).toBe(150);
    expect(r.breakEvenUnits).toBe(600);
    expect(r.operatingProfit).toBe(30000);
    expect(r.marginOfSafetyPct).toBeCloseTo(25);
  });

  it('case C: zero contribution margin — break-even is unreachable', () => {
    const r = calculateResults({ price: 50, variableCost: 50, fixedCosts: 10000, volume: 500, growthRate: 0 });
    expect(r.contributionPerUnit).toBe(0);
    expect(r.breakEvenUnits).toBe(Infinity);
    expect(r.operatingProfit).toBe(-10000);
  });

  it('case D: negative contribution margin', () => {
    const r = calculateResults({ price: 80, variableCost: 90, fixedCosts: 5000, volume: 1000, growthRate: 0 });
    expect(r.contributionPerUnit).toBe(-10);
    expect(r.breakEvenUnits).toBe(Infinity);
    expect(r.operatingProfit).toBe(-15000);
  });
});

describe('buildSensitivityGrid', () => {
  it('centre cell equals baseline operating profit', () => {
    const i = { price: 100, variableCost: 60, fixedCosts: 40000, volume: 1500, growthRate: 0 };
    const grid = buildSensitivityGrid(i);
    const centre = grid[2][2];
    expect(centre.priceChange).toBe(0);
    expect(centre.volumeChange).toBe(0);
    expect(centre.profit).toBe(1500 * 40 - 40000);
  });

  it('returns a 5x5 grid', () => {
    const grid = buildSensitivityGrid({ price: 100, variableCost: 60, fixedCosts: 0, volume: 100, growthRate: 0 });
    expect(grid).toHaveLength(5);
    expect(grid[0]).toHaveLength(5);
  });

  it('raising price and volume increases profit', () => {
    const i = { price: 100, variableCost: 60, fixedCosts: 10000, volume: 500, growthRate: 0 };
    const grid = buildSensitivityGrid(i);
    expect(grid[4][4].profit).toBeGreaterThan(grid[0][0].profit);
  });
});

describe('projectMonths', () => {
  it('returns 12 points by default', () => {
    expect(projectMonths({ price: 100, variableCost: 60, fixedCosts: 0, volume: 100, growthRate: 10 })).toHaveLength(12);
  });

  it('first month equals baseline with no growth', () => {
    const p = projectMonths({ price: 100, variableCost: 60, fixedCosts: 5000, volume: 200, growthRate: 0 });
    expect(p[0].revenue).toBe(20000);
    expect(p[0].profit).toBe(200 * 40 - 5000);
  });

  it('revenue grows month over month with positive growth', () => {
    const p = projectMonths({ price: 100, variableCost: 60, fixedCosts: 0, volume: 100, growthRate: 10 });
    expect(p[11].revenue).toBeGreaterThan(p[0].revenue);
  });
});
