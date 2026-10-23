import { test, expect } from '@playwright/test';

test.describe('Pricing Sandbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with default results', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /pricing.*sandbox/i })).toBeVisible();
    await expect(page.getByTestId('operating-profit')).toContainText('KES');
    await expect(page.getByTestId('breakeven-units')).not.toBeEmpty();
  });

  test('changing price updates break-even units', async ({ page }) => {
    const before = await page.getByTestId('breakeven-units').textContent();
    const priceInput = page.getByTestId('price');
    await priceInput.fill('200');
    await priceInput.blur();
    const after = await page.getByTestId('breakeven-units').textContent();
    expect(after).not.toBe(before);
  });

  test('renders a 5x5 sensitivity grid plus headers', async ({ page }) => {
    const table = page.getByTestId('sensitivity-table');
    await expect(table).toBeVisible();
    await expect(table.locator('tbody tr')).toHaveCount(5);
    await expect(table.locator('tbody tr').first().locator('td')).toHaveCount(5);
  });

  test('projection chart renders', async ({ page }) => {
    await expect(page.getByTestId('projection-chart')).toBeVisible();
    await expect(page.getByTestId('projection-chart').locator('.recharts-surface')).toBeVisible();
  });

  test('saving a scenario produces a comparison row', async ({ page }) => {
    await page.getByTestId('save-scenario').click();
    await expect(page.getByTestId('compare-table')).toBeVisible();
    await expect(page.getByTestId('compare-table').locator('thead th')).toContainText(['', 'Current', 'Scenario 1']);
  });

  test('currency selector changes formatting', async ({ page }) => {
    await page.getByTestId('currency').selectOption('USD');
    await expect(page.getByTestId('operating-profit')).toContainText('USD');
  });
});
