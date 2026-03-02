import { countRules, formatQueryString } from '../queryUtils';

describe('countRules', () => {
  it('returns 0 for null query', () => {
    expect(countRules(null)).toBe(0);
  });

  it('returns 0 for query with no rules', () => {
    expect(countRules({ combinator: 'and', rules: [] })).toBe(0);
  });

  it('counts flat rules', () => {
    const query = {
      combinator: 'and',
      rules: [
        { field: 'name', operator: '=', value: 'Alice' },
        { field: 'age', operator: '>', value: 25 },
      ],
    };
    expect(countRules(query)).toBe(2);
  });

  it('counts rules in nested groups', () => {
    const query = {
      combinator: 'and',
      rules: [
        { field: 'name', operator: '=', value: 'Alice' },
        {
          combinator: 'or',
          rules: [
            { field: 'age', operator: '>', value: 25 },
            { field: 'age', operator: '<', value: 50 },
          ],
        },
      ],
    };
    expect(countRules(query)).toBe(3);
  });

  it('does not count empty groups as rules', () => {
    const query = {
      combinator: 'and',
      rules: [
        { combinator: 'or', rules: [] },
        { field: 'name', operator: '=', value: 'Alice' },
      ],
    };
    expect(countRules(query)).toBe(1);
  });

  it('does not count incomplete rules (missing field or operator)', () => {
    const query = {
      combinator: 'and',
      rules: [
        { field: '', operator: '=', value: 'test' },
        { field: 'name', operator: '', value: 'test' },
        { field: 'name', operator: '=', value: 'Alice' },
      ],
    };
    expect(countRules(query)).toBe(1);
  });
});

describe('formatQueryString', () => {
  it('returns placeholder for null query', () => {
    expect(formatQueryString(null)).toBe('No filters applied');
  });

  it('returns placeholder for empty rules', () => {
    expect(formatQueryString({ combinator: 'and', rules: [] })).toBe('No filters applied');
  });

  it('returns JSON string for non-empty query', () => {
    const query = {
      combinator: 'and',
      rules: [{ field: 'name', operator: '=', value: 'Alice' }],
    };
    const result = formatQueryString(query);
    expect(result).toContain('name');
    expect(result).toContain('Alice');
  });
});
