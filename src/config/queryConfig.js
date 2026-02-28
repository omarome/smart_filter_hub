import { defaultOperators as rqbDefaultOperators, toFullOption } from 'react-querybuilder';

/**
 * Re-export the library's defaultOperators so consumers don't need to
 * import from react-querybuilder directly.
 */
export const defaultOperators = rqbDefaultOperators;

/**
 * Operator names allowed per data type.
 */
const stringTypeOperators = [
  '=', 
  '!=',
  'contains', 
  'doesNotContain',
  'beginsWith', 
  'doesNotBeginWith',
  'endsWith', 
  'doesNotEndWith',
  'null', 
  'notNull',
];

const numberTypeOperators = [
  '=',
  '!=',
  '<',
  '>',
  '<=',
  '>=',
  'between', 
  'notBetween',
  'null', 
  'notNull',
];

const booleanTypeOperators = ['='];

/**
 * Operator subsets per data type, filtered from the library's defaults.
 */
const stringOperators = rqbDefaultOperators.filter((op) => stringTypeOperators.includes(op.name));
const numberOperators = rqbDefaultOperators.filter((op) => numberTypeOperators.includes(op.name));
const booleanOperators = rqbDefaultOperators.filter((op) => booleanTypeOperators.includes(op.name));

/**
 * Base field definitions.
 * Each field declares its own operators inline, following the
 * react-querybuilder demo pattern.
 */
export const baseFields = [
  { name: 'firstName', label: 'First Name', placeholder: 'Enter first name', type: 'string', operators: stringOperators },
  { name: 'lastName', label: 'Last Name', placeholder: 'Enter last name', type: 'string', operators: stringOperators },
  { name: 'age', label: 'Age', inputType: 'number', type: 'number', operators: numberOperators },
  { name: 'email', label: 'Email', placeholder: 'Enter email', type: 'email', operators: stringOperators },
  { name: 'status', label: 'Status', type: 'string', operators: stringOperators },
  { name: 'nickname', label: 'Nickname', placeholder: 'Enter nickname', type: 'string', operators: stringOperators },
  {
    name: 'isOnline',
    label: 'Is Online',
    type: 'boolean',
    valueEditorType: 'radio',
    values: [
      { name: 'true', label: 'True' },
      { name: 'false', label: 'False' },
    ],
    defaultValue: 'true',
    operators: booleanOperators,
  },
].map((field) => toFullOption(field));

