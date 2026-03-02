import { createFieldValidator } from '../index';

describe('createFieldValidator', () => {
  describe('null/notNull operators', () => {
    it('skips validation for null operator', () => {
      const validator = createFieldValidator('Name', 'string');
      expect(validator({ field: 'name', operator: 'null', value: '' })).toBe(true);
    });

    it('skips validation for notNull operator', () => {
      const validator = createFieldValidator('Name', 'string');
      expect(validator({ field: 'name', operator: 'notNull', value: '' })).toBe(true);
    });
  });

  describe('empty values', () => {
    it('rejects null value', () => {
      const validator = createFieldValidator('Name', 'string');
      const result = validator({ field: 'name', operator: '=', value: null });
      expect(result).toEqual({ valid: false, message: 'Name cannot be empty' });
    });

    it('rejects undefined value', () => {
      const validator = createFieldValidator('Name', 'string');
      const result = validator({ field: 'name', operator: '=', value: undefined });
      expect(result).toEqual({ valid: false, message: 'Name cannot be empty' });
    });

    it('rejects blank string', () => {
      const validator = createFieldValidator('Name', 'string');
      const result = validator({ field: 'name', operator: '=', value: '   ' });
      expect(result).toEqual({ valid: false, message: 'Name cannot be empty' });
    });
  });

  describe('sanitization (cross-cutting)', () => {
    it('rejects SQL injection in string fields', () => {
      const validator = createFieldValidator('Name', 'string');
      const result = validator({ field: 'name', operator: '=', value: 'DROP TABLE users' });
      expect(result.valid).toBe(false);
    });

    it('rejects dangerous characters in number fields', () => {
      const validator = createFieldValidator('Age', 'number');
      const result = validator({ field: 'age', operator: '=', value: "42'" });
      expect(result.valid).toBe(false);
    });
  });

  describe('string type validation', () => {
    it('passes valid string', () => {
      const validator = createFieldValidator('Name', 'string');
      expect(validator({ field: 'name', operator: '=', value: 'John' })).toBe(true);
    });

    it('rejects overly long string', () => {
      const validator = createFieldValidator('Name', 'string');
      const result = validator({ field: 'name', operator: '=', value: 'a'.repeat(256) });
      expect(result.valid).toBe(false);
    });
  });

  describe('number type validation', () => {
    it('passes valid number', () => {
      const validator = createFieldValidator('Age', 'number');
      expect(validator({ field: 'age', operator: '=', value: '25' })).toBe(true);
    });

    it('rejects non-numeric input', () => {
      const validator = createFieldValidator('Age', 'number');
      const result = validator({ field: 'age', operator: '=', value: 'abc' });
      expect(result.valid).toBe(false);
    });

    it('respects allowNegative option', () => {
      const validator = createFieldValidator('Age', 'number', { allowNegative: false });
      const result = validator({ field: 'age', operator: '=', value: '-5' });
      expect(result.valid).toBe(false);
    });
  });

  describe('email type validation', () => {
    it('passes valid email', () => {
      const validator = createFieldValidator('Email', 'email');
      expect(validator({ field: 'email', operator: '=', value: 'test@example.com' })).toBe(true);
    });

    it('rejects invalid email', () => {
      const validator = createFieldValidator('Email', 'email');
      const result = validator({ field: 'email', operator: '=', value: 'notanemail' });
      expect(result.valid).toBe(false);
    });
  });

  describe('between/notBetween operators (multi-value)', () => {
    it('validates both parts of a comma-separated between value', () => {
      const validator = createFieldValidator('Age', 'number');
      expect(validator({ field: 'age', operator: 'between', value: '10,50' })).toBe(true);
    });

    it('rejects if one part of between is invalid', () => {
      const validator = createFieldValidator('Age', 'number');
      const result = validator({ field: 'age', operator: 'between', value: '10,abc' });
      expect(result.valid).toBe(false);
    });

    it('rejects if between has only one value', () => {
      const validator = createFieldValidator('Age', 'number');
      const result = validator({ field: 'age', operator: 'between', value: '10' });
      expect(result).toEqual({ valid: false, message: 'Age requires exactly two values' });
    });

    it('handles array-format values for between', () => {
      const validator = createFieldValidator('Age', 'number');
      expect(validator({ field: 'age', operator: 'between', value: [10, 50] })).toBe(true);
    });

    it('validates notBetween the same way', () => {
      const validator = createFieldValidator('Age', 'number');
      expect(validator({ field: 'age', operator: 'notBetween', value: '20,40' })).toBe(true);
    });
  });

  describe('unknown field type', () => {
    it('falls back to sanitization-only (no type validator)', () => {
      const validator = createFieldValidator('Custom', 'boolean');
      expect(validator({ field: 'custom', operator: '=', value: 'true' })).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles null/undefined rule gracefully', () => {
      const validator = createFieldValidator('Name', 'string');
      const result = validator(null);
      expect(result).toEqual({ valid: false, message: 'Name cannot be empty' });
    });
  });
});
