import { extractUniqueValues, enhanceFieldWithValues } from '../fieldUtils';

describe('extractUniqueValues', () => {
  const data = [
    { name: 'Alice', status: 'Active' },
    { name: 'Bob', status: 'Inactive' },
    { name: 'Charlie', status: 'Active' },
    { name: 'Diana', status: null },
    { name: '', status: 'Pending' },
  ];

  it('extracts unique sorted values for a field', () => {
    const result = extractUniqueValues(data, 'status');
    expect(result).toHaveLength(3);
    expect(result.map((v) => v.name)).toEqual(['Active', 'Inactive', 'Pending']);
  });

  it('excludes null, undefined, and empty values', () => {
    const result = extractUniqueValues(data, 'status');
    expect(result.find((v) => v.name === '' || v.name === 'null')).toBeUndefined();
  });

  it('returns empty array for null data', () => {
    expect(extractUniqueValues(null, 'name')).toEqual([]);
  });

  it('returns empty array for empty data', () => {
    expect(extractUniqueValues([], 'name')).toEqual([]);
  });

  it('returns objects with name, label, and value properties', () => {
    const result = extractUniqueValues(data, 'name');
    result.forEach((item) => {
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
      expect(item.name).toBe(item.label);
    });
  });

  it('deduplicates values', () => {
    const result = extractUniqueValues(data, 'status');
    const names = result.map((v) => v.name);
    expect(names).toEqual([...new Set(names)]);
  });
});

describe('enhanceFieldWithValues', () => {
  const data = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ];

  it('adds suggestion values for text fields', () => {
    const field = { name: 'name', label: 'Name', type: 'string' };
    const result = enhanceFieldWithValues(data, field);
    expect(result.values).toHaveLength(2);
    expect(result.valueEditorType).toBe('text');
  });

  it('attaches a validator function', () => {
    const field = { name: 'name', label: 'Name', type: 'string' };
    const result = enhanceFieldWithValues(data, field);
    expect(typeof result.validator).toBe('function');
  });

  it('preserves existing values if already set', () => {
    const existingValues = [{ name: 'X', label: 'X', value: 'X' }];
    const field = { name: 'name', label: 'Name', type: 'string', values: existingValues };
    const result = enhanceFieldWithValues(data, field);
    expect(result.values).toBe(existingValues);
  });

  it('does not add suggestion values for radio/select editors', () => {
    const field = {
      name: 'isOnline',
      label: 'Is Online',
      type: 'boolean',
      valueEditorType: 'radio',
      values: [
        { name: 'true', label: 'True' },
        { name: 'false', label: 'False' },
      ],
    };
    const result = enhanceFieldWithValues(data, field);
    expect(result.values).toEqual(field.values);
    expect(typeof result.validator).toBe('function');
  });

  it('defaults type to string when unspecified', () => {
    const field = { name: 'custom', label: 'Custom' };
    const result = enhanceFieldWithValues(data, field);
    expect(typeof result.validator).toBe('function');
    expect(result.valueEditorType).toBe('text');
  });
});
