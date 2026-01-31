import React, { useState } from 'react';
import type { Filter } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Filter as FilterIcon } from 'lucide-react';
import { getOperatorsForField } from '@/utils/filterOperators';

interface FilterBuilderProps {
  filters: Filter[];
  logic: 'AND' | 'OR';
  onFiltersChange: (filters: Filter[]) => void;
  onLogicChange: (logic: 'AND' | 'OR') => void;
  onApply: () => void;
}

const fields = [
  { value: 'employeeId', label: 'Employee ID' },
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'department', label: 'Department' },
  { value: 'position', label: 'Position' },
  { value: 'salary', label: 'Salary' },
  { value: 'hireDate', label: 'Hire Date' },
  { value: 'status', label: 'Status' },
  { value: 'location', label: 'Location' },
  { value: 'age', label: 'Age' },
];

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  filters,
  logic,
  onFiltersChange,
  onLogicChange,
  onApply
}) => {
  const addFilter = () => {
    const newFilter: Filter = {
      id: Date.now().toString(),
      field: 'firstName',
      operator: 'contains',
      value: ''
    };
    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<Filter>) => {
    onFiltersChange(
      filters.map(f => f.id === id ? { ...f, ...updates } : f)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Filter Conditions</h3>
        {filters.length > 1 && (
          <Select value={logic} onValueChange={(value: 'AND' | 'OR') => onLogicChange(value)}>
            <SelectTrigger className="w-24" data-testid="filter-logic-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-3">
        {filters.map((filter, index) => (
          <div key={filter.id} data-testid={`filter-row-${index}`} className="space-y-2">
            {index > 0 && (
              <div className="text-xs font-medium text-slate-500 text-center py-1">
                {logic}
              </div>
            )}
            <div className="p-4 bg-slate-50 rounded-lg space-y-3 border border-slate-200">
              <div className="flex gap-2">
                <Select
                  value={filter.field}
                  onValueChange={(value) => updateFilter(filter.id, { field: value })}
                >
                  <SelectTrigger data-testid={`filter-field-${index}`} className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map(field => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  data-testid={`remove-filter-${index}`}
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFilter(filter.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Select
                value={filter.operator}
                onValueChange={(value) => updateFilter(filter.id, { operator: value })}
              >
                <SelectTrigger data-testid={`filter-operator-${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getOperatorsForField(filter.field).map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                data-testid={`filter-value-${index}`}
                placeholder="Enter value..."
                value={filter.value}
                onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                className="w-full"
              />
              
              {filter.operator === 'between' && (
                <p className="text-xs text-slate-500">Format: min, max (e.g., 40000, 80000)</p>
              )}
              {filter.operator === 'inList' && (
                <p className="text-xs text-slate-500">Format: comma-separated values</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          data-testid="add-filter-btn"
          variant="outline"
          onClick={addFilter}
          className="flex-1 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Condition
        </Button>
        {filters.length > 0 && (
          <Button
            data-testid="apply-filters-btn"
            onClick={onApply}
            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <FilterIcon className="w-4 h-4" />
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  );
};
