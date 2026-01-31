import React from 'react';
import type { Employee, SortField, SortOrder } from '@/types';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  sortField,
  sortOrder,
  onSort
}) => {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: { field: SortField; label: string; width?: string }[] = [
    { field: 'employeeId', label: 'ID', width: 'w-28' },
    { field: 'firstName', label: 'First Name', width: 'w-32' },
    { field: 'lastName', label: 'Last Name', width: 'w-32' },
    { field: 'email', label: 'Email', width: 'w-56' },
    { field: 'department', label: 'Department', width: 'w-36' },
    { field: 'position', label: 'Position', width: 'w-48' },
    { field: 'salary', label: 'Salary', width: 'w-32' },
    { field: 'hireDate', label: 'Hire Date', width: 'w-32' },
    { field: 'status', label: 'Status', width: 'w-28' },
    { field: 'location', label: 'Location', width: 'w-32' },
    { field: 'age', label: 'Age', width: 'w-20' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full" data-testid="employee-table">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map(({ field, label, width }) => (
              <th
                key={field}
                data-testid={`column-header-${field}`}
                className={`${width || 'w-auto'} px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors`}
                onClick={() => onSort(field)}
              >
                <div className="flex items-center gap-2">
                  {label}
                  <SortIcon field={field} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {employees.map((employee, index) => (
            <tr
              key={employee._id}
              data-testid={`employee-row-${index}`}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {employee.employeeId}
              </td>
              <td className="px-6 py-4 text-sm text-slate-900">
                {employee.firstName}
              </td>
              <td className="px-6 py-4 text-sm text-slate-900">
                {employee.lastName}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {employee.email}
              </td>
              <td className="px-6 py-4 text-sm text-slate-900">
                {employee.department}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {employee.position}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {formatCurrency(employee.salary)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDate(employee.hireDate)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {employee.location}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {employee.age}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No employees found
        </div>
      )}
    </div>
  );
};
