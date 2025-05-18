import React, { useState } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

interface SortOption {
  label: string;
  value: string;
}

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  sortOptions: SortOption[];
  currentSort: string;
  onSortChange: (sortValue: string) => void;
  resultsCount: number;
  categoryName?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  sortOptions,
  currentSort,
  onSortChange,
  resultsCount,
  categoryName,
}) => {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const currentSortOption = sortOptions.find(option => option.value === currentSort);

  return (
    <div className="bg-white py-3 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Barra de pesquisa */}
          <div className="relative flex-grow max-w-2xl">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Pesquisar equipamentos para restaurante..."
                className="w-full py-3 px-5 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={query}
                onChange={e => onQueryChange(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-amber-600 hover:text-amber-800"
                aria-label="Pesquisar"
              >
                <FiSearch size={20} />
              </button>
            </form>
          </div>
          
          {/* Ordenação e contagem */}
          <div className="flex items-center justify-between md:justify-end space-x-4">
            {/* Dropdown de ordenação */}
            <div className="relative">
              <button
                className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                <span className="text-sm mr-2">Ordenar por:</span>
                <span className="text-sm font-medium">{currentSortOption?.label}</span>
                <FiChevronDown className="ml-2" />
              </button>
              
              {sortDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 w-56">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        currentSort === option.value
                          ? 'bg-amber-50 text-amber-800'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => {
                        onSortChange(option.value);
                        setSortDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Resultados e metadados */}
        <div className="mt-4">
          <p className="text-md font-medium text-gray-800">
            <span className="font-bold">{resultsCount}</span> 
            {' '}produtos {categoryName && `em ${categoryName}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 