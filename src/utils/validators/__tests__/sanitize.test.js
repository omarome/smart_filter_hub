import { detectDangerousInput } from '../sanitize';

describe('detectDangerousInput', () => {
  describe('clean values', () => {
    it.each([
      'hello',
      'John Doe',
      'test@example.com',
      '12345',
      'some-value-with-dashes',
      'value_with_underscores',
      'CamelCaseValue',
      'spaces are fine',
      '100.50',
    ])('returns null for safe input: "%s"', (value) => {
      expect(detectDangerousInput(value)).toBeNull();
    });
  });

  describe('dangerous characters', () => {
    it.each([
      [';', ';'],
      ["'", "'"],
      ['"', '"'],
      ['\\', '\\'],
      ['`', '`'],
    ])('rejects input containing "%s"', (char, _) => {
      const result = detectDangerousInput(`test${char}value`);
      expect(result).toContain('is not allowed');
    });

    it('identifies the specific dangerous character in the message', () => {
      expect(detectDangerousInput("it's")).toContain("'");
    });
  });

  describe('SQL injection patterns', () => {
    it.each([
      'SELECT * FROM users',
      'DROP TABLE users',
      'INSERT INTO users',
      'UPDATE users SET',
      'DELETE FROM users',
      'ALTER TABLE users',
      'CREATE TABLE users',
      'EXEC sp_help',
      'EXECUTE sp_help',
    ])('rejects SQL keyword: "%s"', (value) => {
      const result = detectDangerousInput(value);
      expect(result).toBeTruthy();
    });

    it('rejects UNION SELECT pattern', () => {
      expect(detectDangerousInput('UNION SELECT id')).toBeTruthy();
    });

    it('rejects UNION ALL SELECT pattern', () => {
      expect(detectDangerousInput('UNION ALL SELECT id')).toBeTruthy();
    });

    it('rejects SQL comment syntax --', () => {
      expect(detectDangerousInput('value--comment')).toBeTruthy();
    });

    it('rejects SQL block comment syntax /*', () => {
      expect(detectDangerousInput('value/*comment')).toBeTruthy();
    });

    it('rejects OR-based injection', () => {
      expect(detectDangerousInput('OR 1=1')).toBeTruthy();
    });

    it('is case-insensitive for SQL keywords', () => {
      expect(detectDangerousInput('select * from users')).toBeTruthy();
      expect(detectDangerousInput('Select * From Users')).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('allows normal words that contain SQL substrings', () => {
      // "selector" contains "select" but is not a SQL keyword (word-boundary check)
      expect(detectDangerousInput('selector')).toBeNull();
    });

    it('allows the word "dropped" (contains "drop" but not at word boundary)', () => {
      expect(detectDangerousInput('dropped')).toBeNull();
    });
  });
});
