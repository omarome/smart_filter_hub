import { validateEmail } from '../emailValidator';

describe('validateEmail', () => {
  describe('valid emails', () => {
    it.each([
      'test@example.com',
      'user.name@domain.org',
      'user+tag@domain.co.uk',
      'a@b.io',
    ])('returns true for "%s"', (email) => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it.each([
      ['missing @', 'testexample.com'],
      ['missing domain', 'test@'],
      ['missing TLD', 'test@domain'],
      ['missing local part', '@domain.com'],
      ['has spaces', 'test @example.com'],
      ['plain text', 'notanemail'],
    ])('returns error for %s: "%s"', (_desc, email) => {
      const result = validateEmail(email);
      expect(result).toEqual({
        valid: false,
        message: 'Please enter a valid email address',
      });
    });
  });
});
