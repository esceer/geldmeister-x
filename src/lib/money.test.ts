import { describe, expect, it } from '@jest/globals';

import {
  applyKey,
  currencySymbol,
  fitInput,
  formatAmount,
  formatInput,
  formatMoney,
  inputToMinor,
  minorToInput,
  type KeypadKey,
} from './money';

const type = (keys: string, decimals: number) =>
  [...keys].reduce((input, key) => applyKey(input, key as KeypadKey, decimals), '');

// Intl output uses (narrow) no-break spaces for grouping in some locales.
const normalize = (s: string) => s.replace(/[  ]/g, ' ');

describe('applyKey', () => {
  it('builds whole amounts', () => {
    expect(type('18450', 0)).toBe('18450');
  });

  it('ignores the decimal mark for zero-decimal currencies', () => {
    expect(type('12.5', 0)).toBe('125');
  });

  it('limits fraction digits to the currency decimals', () => {
    expect(type('12.505', 2)).toBe('12.50');
  });

  it('allows a single decimal mark and prefixes a leading one with 0', () => {
    expect(type('.5.', 2)).toBe('0.5');
  });

  it('replaces a leading zero', () => {
    expect(type('007', 0)).toBe('7');
  });

  it('caps the integer part at 9 digits', () => {
    expect(type('1234567890', 0)).toBe('123456789');
  });

  it('deletes the last character', () => {
    expect(applyKey('12.5', 'back', 2)).toBe('12.');
    expect(applyKey('', 'back', 2)).toBe('');
  });
});

describe('minor unit conversion', () => {
  it('converts input to minor units', () => {
    expect(inputToMinor('18450', 0)).toBe(18450);
    expect(inputToMinor('12.5', 2)).toBe(1250);
    expect(inputToMinor('12.', 2)).toBe(1200);
    expect(inputToMinor('0.07', 2)).toBe(7);
    expect(inputToMinor('', 2)).toBe(0);
  });

  it('converts minor units back to input', () => {
    expect(minorToInput(18450, 0)).toBe('18450');
    expect(minorToInput(1250, 2)).toBe('12.5');
    expect(minorToInput(1200, 2)).toBe('12');
    expect(minorToInput(7, 2)).toBe('0.07');
  });

  it('fits input to another currency', () => {
    expect(fitInput('12.55', 0)).toBe('12');
    expect(fitInput('12.', 0)).toBe('12');
    expect(fitInput('12.5', 2)).toBe('12.5');
    expect(fitInput('1250', 2)).toBe('1250');
  });
});

describe('formatting', () => {
  it('formats amounts per locale', () => {
    expect(normalize(formatAmount(1845000, 0, 'hu'))).toBe('1 845 000');
    expect(formatAmount(1250, 2, 'en')).toBe('12.50');
  });

  it('formats keypad input as typed', () => {
    expect(normalize(formatInput('12345.5', 'hu'))).toBe('12 345,5');
    expect(formatInput('12.', 'en')).toBe('12.');
    expect(formatInput('', 'en')).toBe('0');
  });

  it('formats money as amount followed by the symbol', () => {
    expect(normalize(formatMoney(18450, 'HUF', 0, 'hu'))).toBe('18 450 Ft');
    expect(formatMoney(1250, 'EUR', 2, 'en')).toBe('12.50 €');
  });

  it('falls back to the currency code without a known symbol', () => {
    expect(currencySymbol('HUF')).toBe('Ft');
    expect(currencySymbol('CHF')).toBe('CHF');
  });
});
