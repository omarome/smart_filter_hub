import { validateNumber } from '../numberValidator';

describe('validateNumber', () => {
  describe('basic validation', () => {
    it('returns true for a valid integer', () => {
      expect(validateNumber('42', 'Age')).toBe(true);
    });

    it('returns true for zero', () => {
      expect(validateNumber('0', 'Age')).toBe(true);
    });

    it('returns true for a decimal number', () => {
      expect(validateNumber('3.14', 'Value')).toBe(true);
    });

    it('returns error for non-numeric input', () => {
      const result = validateNumber('abc', 'Age');
      expect(result).toEqual({ valid: false, message: 'Please enter a valid number' });
    });

    it('treats empty string as 0 (Number("") === 0)', () => {
      // Number('') is 0, not NaN — empty-check is handled by the pipeline in index.js
      expect(validateNumber('', 'Age')).toBe(true);
    });
  });

  describe('negative values (allowNegative = true, default)', () => {
    it('allows negative integers', () => {
      expect(validateNumber('-5', 'Temperature')).toBe(true);
    });

    it('allows negative decimals', () => {
      expect(validateNumber('-3.14', 'Temperature')).toBe(true);
    });
  });

  describe('unsigned types (allowNegative = false)', () => {
    it('rejects negative values', () => {
      const result = validateNumber('-1', 'Age', { allowNegative: false });
      expect(result).toEqual({
        valid: false,
        message: 'Age must be a non-negative number',
      });
    });

    it('rejects decimal values (unsigned = integer only)', () => {
      const result = validateNumber('3.5', 'Age', { allowNegative: false });
      expect(result).toEqual({
        valid: false,
        message: 'Age must be a whole number',
      });
    });

    it('allows zero for unsigned types', () => {
      expect(validateNumber('0', 'Age', { allowNegative: false })).toBe(true);
    });

    it('allows positive integers for unsigned types', () => {
      expect(validateNumber('100', 'Age', { allowNegative: false })).toBe(true);
    });
  });
});
