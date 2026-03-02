import { buildFieldsFromVariables } from '../queryConfig';

describe('buildFieldsFromVariables', () => {
  it('returns empty array for null input', () => {
    expect(buildFieldsFromVariables(null)).toEqual([]);
  });

  it('returns empty array for empty array', () => {
    expect(buildFieldsFromVariables([])).toEqual([]);
  });

  it('maps STRING type to string', () => {
    const variables = [{ name: 'firstName', label: 'First Name', type: 'STRING' }];
    const fields = buildFieldsFromVariables(variables);
    expect(fields[0].type).toBe('string');
  });

  it('maps UDINT type to number', () => {
    const variables = [{ name: 'age', label: 'Age', type: 'UDINT' }];
    const fields = buildFieldsFromVariables(variables);
    expect(fields[0].type).toBe('number');
    expect(fields[0].inputType).toBe('number');
  });

  it('maps BOOL type to boolean with radio editor', () => {
    const variables = [{ name: 'isOnline', label: 'Is Online', type: 'BOOL' }];
    const fields = buildFieldsFromVariables(variables);
    expect(fields[0].type).toBe('boolean');
    expect(fields[0].valueEditorType).toBe('radio');
    expect(fields[0].values).toHaveLength(2);
    expect(fields[0].defaultValue).toBe('true');
  });

  it('maps EMAIL type to email (uses string operators)', () => {
    const variables = [{ name: 'email', label: 'Email', type: 'EMAIL' }];
    const fields = buildFieldsFromVariables(variables);
    expect(fields[0].type).toBe('email');
  });

  it('applies fieldEditorOverrides for "status" field', () => {
    const variables = [{ name: 'status', label: 'Status', type: 'STRING' }];
    const fields = buildFieldsFromVariables(variables);
    expect(fields[0].valueEditorType).toBe('select');
    expect(fields[0].values).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Active' }),
        expect.objectContaining({ name: 'Inactive' }),
        expect.objectContaining({ name: 'Pending' }),
      ])
    );
  });

  it('sets allowNegative=false for unsigned types (UDINT, UINT)', () => {
    const variables = [{ name: 'count', label: 'Count', type: 'UINT' }];
    const fields = buildFieldsFromVariables(variables);
    expect(fields[0].allowNegative).toBe(false);
  });

  it('sets allowNegative=true for signed types (INT, DINT, REAL, LREAL)', () => {
    const variables = [{ name: 'temp', label: 'Temperature', type: 'DINT' }];
    const fields = buildFieldsFromVariables(variables);
    expect(fields[0].allowNegative).toBe(true);
  });

  it('falls back to string type for unknown backend types', () => {
    const variables = [{ name: 'custom', label: 'Custom', type: 'UNKNOWN_TYPE' }];
    const fields = buildFieldsFromVariables(variables);
    expect(fields[0].type).toBe('string');
  });

  it('assigns the correct operators for each type', () => {
    const variables = [
      { name: 'name', label: 'Name', type: 'STRING' },
      { name: 'age', label: 'Age', type: 'UDINT' },
      { name: 'active', label: 'Active', type: 'BOOL' },
    ];
    const fields = buildFieldsFromVariables(variables);

    const stringOps = fields[0].operators.map((o) => o.name);
    expect(stringOps).toContain('contains');
    expect(stringOps).toContain('beginsWith');
    expect(stringOps).not.toContain('<');

    const numberOps = fields[1].operators.map((o) => o.name);
    expect(numberOps).toContain('<');
    expect(numberOps).toContain('between');
    expect(numberOps).not.toContain('contains');

    const boolOps = fields[2].operators.map((o) => o.name);
    expect(boolOps).toEqual(['=']);
  });

  it('preserves name and label from variables', () => {
    const variables = [{ name: 'firstName', label: 'First Name', type: 'STRING' }];
    const fields = buildFieldsFromVariables(variables);
    expect(fields[0].name).toBe('firstName');
    expect(fields[0].label).toBe('First Name');
  });
});
