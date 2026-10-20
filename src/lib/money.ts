// Amounts are integer minor units; `decimals` is the currency's minor-unit digits (HUF 0, EUR 2).
// Keypad input is a plain string using '.' as the decimal mark, e.g. "1250" or "12.5".

const MAX_INTEGER_DIGITS = 9;

export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | 'back';

export function applyKey(input: string, key: KeypadKey, decimals: number): string {
  if (key === 'back') return input.slice(0, -1);

  const [integer, fraction] = input.split('.');
  if (key === '.') {
    if (decimals === 0 || fraction !== undefined) return input;
    return (input || '0') + '.';
  }
  if (fraction !== undefined) return fraction.length < decimals ? input + key : input;
  if (integer === '0') return key;
  return integer.length < MAX_INTEGER_DIGITS ? input + key : input;
}

export function inputToMinor(input: string, decimals: number): number {
  const [integer, fraction = ''] = input.split('.');
  return Number(integer || 0) * 10 ** decimals + Number(fraction.padEnd(decimals, '0') || 0);
}

export function minorToInput(minor: number, decimals: number): string {
  const integer = Math.trunc(minor / 10 ** decimals);
  const fraction = String(minor % 10 ** decimals)
    .padStart(decimals, '0')
    .replace(/0+$/, '');
  return fraction ? `${integer}.${fraction}` : String(integer);
}

/** Number without currency, e.g. "18 450" (hu) or "12.50" (en). */
export function formatAmount(minor: number, decimals: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(minor / 10 ** decimals);
}

/** Keypad input as typed, with locale grouping and decimal mark, e.g. "12 345,5". */
export function formatInput(input: string, locale: string): string {
  const [integer, fraction] = input.split('.');
  const grouped = new Intl.NumberFormat(locale).format(Number(integer || 0));
  return fraction === undefined ? grouped : grouped + decimalSeparator(locale) + fraction;
}

// Hermes' Intl ignores currencyDisplay 'narrowSymbol', so common symbols are listed here.
const symbols: Record<string, string> = {
  HUF: 'Ft',
  EUR: '€',
  USD: '$',
  GBP: '£',
  PLN: 'zł',
  CZK: 'Kč',
  RON: 'lei',
};

/** Currency symbol, falling back to the ISO code, e.g. "Ft" or "CHF". */
export const currencySymbol = (currency: string) => symbols[currency] ?? currency;

/** Amount followed by the symbol, as in the design, e.g. "18 450 Ft" or "12.50 €". */
export function formatMoney(minor: number, currency: string, decimals: number, locale: string) {
  return `${formatAmount(minor, decimals, locale)} ${currencySymbol(currency)}`;
}

export function decimalSeparator(locale: string): string {
  return new Intl.NumberFormat(locale).format(1.5).charAt(1);
}
