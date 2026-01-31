import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import type { Employee, EmployeesResponse, Filter, Preset, SortField, SortOrder } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { EmployeeTable } from '@/components/EmployeeTable';
import { FilterBuilder } from '@/components/FilterBuilder';
import { PresetManager } from '@/components/PresetManager';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { Filter as FilterIcon, X, RefreshCw } from 'lucide-react';
import '@/App.css';

const BACKEND_URL ="http://localhost:5000";
const API = `${BACKEND_URL}/api`;

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState<SortField>('hireDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterLogic, setFilterLogic] = useState<'AND' | 'OR'>('AND');
  const [showFilters, setShowFilters] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [seeded, setSeeded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Seed database on mount
  useEffect(() => {
    seedDatabase();
  }, []);

  const seedDatabase = async () => {
    try {
      const response = await axios.post(`${API}/seed`);
      console.log(response.data.message);
      setSeeded(true);
      loadPresets();
      loadDefaultPreset();
    } catch (error) {
      console.error('Error seeding database:', error);
      setSeeded(true);
      loadPresets();
      loadDefaultPreset();
    }
  };

  const loadPresets = async () => {
    try {
      const response = await axios.get(`${API}/presets`);
      setPresets(response.data);
    } catch (error) {
      console.error('Error loading presets:', error);
    }
  };

  const loadDefaultPreset = async () => {
    try {
      const response = await axios.get(`${API}/presets/default`);
      if (response.data) {
        setFilters(response.data.filters);
        setFilterLogic(response.data.logic);
        setShowFilters(true);
      }
    } catch (error) {
      console.error('Error loading default preset:', error);
    }
  };

  const fetchEmployees = useCallback(async (pageNum: number, resetData = false) => {
    if (loading || (!hasMore && !resetData)) return;
    
    setLoading(true);
    try {
      const params: any = {
        page: pageNum,
        limit: 50,
        sortField,
        sortOrder
      };

      if (filters.length > 0) {
        params.filters = JSON.stringify(filters);
        params.logic = filterLogic;
      }

      const response = await axios.get<EmployeesResponse>(`${API}/employees`, { params });
      
      if (resetData) {
        setEmployees(response.data.data);
      } else {
        setEmployees(prev => [...prev, ...response.data.data]);
      }
      
      setHasMore(response.data.hasMore);
      setTotal(response.data.total);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, sortField, sortOrder, filters, filterLogic]);

  useEffect(() => {
    if (seeded) {
      fetchEmployees(1, true);
    }
  }, [seeded, sortField, sortOrder, filters, filterLogic]);

  // Infinite scroll
  useEffect(() => {
    if (!loadingRef.current) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchEmployees(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, page, fetchEmployees]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    setHasMore(true);
    fetchEmployees(1, true);
  };

  const handleClearFilters = () => {
    setFilters([]);
    setFilterLogic('AND');
    setPage(1);
    setHasMore(true);
  };

  const handleLoadPreset = (preset: Preset) => {
    setFilters(preset.filters);
    setFilterLogic(preset.logic);
    setShowFilters(true);
    toast.success(`Loaded preset: ${preset.name}`);
  };

  const handleSavePreset = async (name: string, isDefault: boolean) => {
    try {
      await axios.post(`${API}/presets`, {
        name,
        filters,
        logic: filterLogic,
        isDefault
      });
      toast.success('Preset saved successfully');
      loadPresets();
    } catch (error) {
      toast.error('Failed to save preset');
    }
  };

  const handleDeletePreset = async (id: string) => {
    try {
      await axios.delete(`${API}/presets/${id}`);
      toast.success('Preset deleted');
      loadPresets();
    } catch (error) {
      toast.error('Failed to delete preset');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        filterCount={filters.length}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Employee Directory</h1>
              <p className="text-slate-600 mt-1">
                {total.toLocaleString()} employees · Showing {employees.length} records
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                data-testid="toggle-filters-btn"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <FilterIcon className="w-4 h-4" />
                Filters {filters.length > 0 && `(${filters.length})`}
              </Button>
              {filters.length > 0 && (
                <Button
                  data-testid="clear-filters-btn"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </Button>
              )}
              <Button
                data-testid="refresh-btn"
                variant="outline"
                onClick={() => fetchEmployees(1, true)}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-auto p-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <EmployeeTable
                employees={employees}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
                  <p className="mt-2 text-slate-600">Loading more employees...</p>
                </div>
              )}
              {!loading && !hasMore && employees.length > 0 && (
                <div className="text-center py-8 text-slate-500">
                  All {total} employees loaded
                </div>
              )}
              <div ref={loadingRef} className="h-4" />
            </div>
          </div>

          {showFilters && (
            <div className="w-96 border-l border-slate-200 bg-white overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                  <Button
                    data-testid="close-filters-btn"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <PresetManager
                  presets={presets}
                  onLoadPreset={handleLoadPreset}
                  onSavePreset={handleSavePreset}
                  onDeletePreset={handleDeletePreset}
                  hasActiveFilters={filters.length > 0}
                />

                <div className="mt-6">
                  <FilterBuilder
                    filters={filters}
                    logic={filterLogic}
                    onFiltersChange={setFilters}
                    onLogicChange={setFilterLogic}
                    onApply={handleApplyFilters}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
