# Pricing & Unit Economics Sandbox

A browser-based tool for exploring pricing decisions: contribution margin,
break-even, sensitivity to price and volume, and a 12-month projection.

## Features
- Live break-even and contribution margin calculations
- 5x5 sensitivity grid (price change x volume change)
- 12-month revenue and profit projection
- Scenario save and side-by-side comparison
- Currency switching (KES, USD, EUR, GBP)

## Stack
Vite · React · TypeScript · Recharts · Vitest · Playwright

## Model assumptions
- Variable cost is treated as the unit cost of goods.
- Fixed costs are constant month to month.
- Volume grows at the rate set; price is held constant in the projection.
- Break-even = fixed costs / (price - variable cost).
- If contribution per unit is zero or negative, break-even is unreachable.

## Tests
- `pnpm test` - unit fixtures for calculation functions (known-answer cases)
- `pnpm run test:e2e` - Playwright end-to-end tests

## Run
    pnpm install
    pnpm dev

## Build
    pnpm build
    pnpm preview

## License
MIT
