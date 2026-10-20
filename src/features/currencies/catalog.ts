// Currencies offered when adding one. Names live in i18n (currencies.names.<code>).
export const currencyCatalog = [
  'HUF',
  'EUR',
  'USD',
  'GBP',
  'CHF',
  'PLN',
  'CZK',
  'RON',
  'SEK',
  'NOK',
  'DKK',
  'JPY',
] as const;

// Minor-unit digits; HUF is used without fillér in practice.
const zeroDecimals = new Set(['HUF', 'JPY', 'ISK', 'KRW']);
export const defaultDecimals = (code: string) => (zeroDecimals.has(code) ? 0 : 2);
