export interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  location: string;
  age: number;
  phone: string;
  manager?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Filter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface Preset {
  _id: string;
  name: string;
  filters: Filter[];
  logic: 'AND' | 'OR';
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeesResponse {
  data: Employee[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export type SortField = keyof Employee;
export type SortOrder = 'asc' | 'desc';

export interface FilterOperator {
  value: string;
  label: string;
  type: 'string' | 'number' | 'date';
}
