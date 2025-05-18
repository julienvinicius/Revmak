import React from 'react';
import { FiFilter } from 'react-icons/fi';
import { IoFilterSharp } from 'react-icons/io5';

interface FilterOptionProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const FilterOption: React.FC<FilterOptionProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`flex items-center px-4 py-2 rounded-full border transition-all ${
        active 
          ? 'bg-amber-600 text-white border-amber-600' 
          : 'bg-white text-gray-700 border-gray-300 hover:bg-amber-50'
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
};

export interface FilterOption {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface FilterBarProps {
  options: FilterOption[];
  activeFilters: string[];
  onFilterToggle: (filterId: string) => void;
  showMobileFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  options, 
  activeFilters, 
  onFilterToggle,
  showMobileFilters
}) => {
  return (
    <div className="w-full bg-white py-3 border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {options.map((option) => (
              <FilterOption 
                key={option.id}
                icon={option.icon}
                label={option.label}
                active={activeFilters.includes(option.id)}
                onClick={() => onFilterToggle(option.id)}
              />
            ))}
          </div>
          
          {/* Botão filtro mobile */}
          <button 
            className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-700 hover:bg-gray-50 md:hidden"
            onClick={showMobileFilters}
          >
            <FiFilter className="mr-2" />
            <span className="text-sm">Filtros</span>
          </button>
          
          {/* Botão todos os filtros (desktop) */}
          <button 
            className="hidden md:flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-700 hover:bg-gray-50"
            onClick={showMobileFilters}
          >
            <IoFilterSharp className="mr-2" />
            <span className="text-sm">Todos os filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 