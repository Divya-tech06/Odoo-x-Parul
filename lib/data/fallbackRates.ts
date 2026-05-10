/**
 * Frozen exchange rates for fallback when ExchangeRate API key is not available.
 * Base: USD. Last updated reference: May 2025. NOT live data.
 */
export const FALLBACK_EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  JPY: 154.5,
  AED: 3.67,
  SGD: 1.34,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.24,
  THB: 34.5,
  IDR: 15800,
  MXN: 17.2,
  BRL: 5.05,
};
