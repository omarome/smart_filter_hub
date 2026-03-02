import { validateString } from '../stringValidator';

describe('validateString', () => {
  it('returns true for a valid string', () => {
    expect(validateString('hello', 'Name')).toBe(true);
  });

  it('returns true for a single character', () => {
    expect(validateString('a', 'Name')).toBe(true);
  });

  it('returns error for an empty string', () => {
    const result = validateString('', 'Name');
    expect(result).toEqual({ valid: false, message: 'Name cannot be empty' });
  });

  it('returns error when exceeding max length (255)', () => {
    const longString = 'a'.repeat(256);
    const result = validateString(longString, 'Name');
    expect(result).toEqual({
      valid: false,
      message: 'Value is too long (max 255 characters)',
    });
  });

  it('returns true for string at exactly max length', () => {
    const maxString = 'a'.repeat(255);
    expect(validateString(maxString, 'Name')).toBe(true);
  });

  it('includes the field name in the empty-value error', () => {
    const result = validateString('', 'Email');
    expect(result.message).toContain('Email');
  });
});
