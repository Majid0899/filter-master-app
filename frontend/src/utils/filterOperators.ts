import type { FilterOperator } from '@/types';


export const filterOperators: FilterOperator[] = [
  { value: 'equals', label: 'Equals', type: 'string' },
  { value: 'contains', label: 'Contains', type: 'string' },
  { value: 'startsWith', label: 'Starts With', type: 'string' },
  { value: 'endsWith', label: 'Ends With', type: 'string' },
  { value: 'greaterThan', label: 'Greater Than (>)', type: 'number' },
  { value: 'lessThan', label: 'Less Than (<)', type: 'number' },
  { value: 'greaterThanOrEqual', label: 'Greater Than or Equal (>=)', type: 'number' },
  { value: 'lessThanOrEqual', label: 'Less Than or Equal (<=)', type: 'number' },
  { value: 'between', label: 'Between', type: 'number' },
  { value: 'inList', label: 'In List', type: 'string' }
];

export const fieldTypes: Record<string, 'string' | 'number' | 'date'> = {
  employeeId: 'string',
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  department: 'string',
  position: 'string',
  salary: 'number',
  hireDate: 'date',
  status: 'string',
  location: 'string',
  age: 'number',
  phone: 'string',
  manager: 'string'
};

export const getOperatorsForField = (field: string): FilterOperator[] => {
  const fieldType = fieldTypes[field] || 'string';
  
  if (fieldType === 'number') {
    return filterOperators.filter(op => 
      ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between'].includes(op.value)
    );
  }
  
  if (fieldType === 'date') {
    return filterOperators.filter(op => 
      ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between'].includes(op.value)
    );
  }
  
  return filterOperators.filter(op => op.type === 'string');
};
