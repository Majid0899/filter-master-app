import React from 'react';
import { Users, Filter, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onToggleFilters: () => void;
  showFilters: boolean;
  filterCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ onToggleFilters, showFilters, filterCount }) => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">DataTable Pro</h1>
            <p className="text-xs text-slate-400">v1.0.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Button
            data-testid="sidebar-employees-btn"
            variant="ghost"
            className="w-full justify-start text-white hover:bg-slate-800 gap-3"
          >
            <Users className="w-5 h-5" />
            <span>Employees</span>
          </Button>
          
          <Button
            data-testid="sidebar-filters-btn"
            variant={showFilters ? 'secondary' : 'ghost'}
            className="w-full justify-start text-white hover:bg-slate-800 gap-3"
            onClick={onToggleFilters}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {filterCount > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {filterCount}
              </span>
            )}
          </Button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          <p>Advanced Filtering System</p>
          <p className="mt-1">Infinite Scroll • Sort • Presets</p>
        </div>
      </div>
    </div>
  );
};
