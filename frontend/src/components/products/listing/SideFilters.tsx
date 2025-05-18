import React from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';

interface PriceRange {
  min: number;
  max: number;
}

export interface FilterGroup {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: {
    id: string;
    label: string;
    count?: number;
  }[];
  priceRange?: {
    min: number;
    max: number;
    current: PriceRange;
  };
}

interface SideFiltersProps {
  filterGroups: FilterGroup[];
  activeFilters: Record<string, string[]>;
  activePriceRanges: Record<string, PriceRange>;
  onFilterChange: (groupId: string, optionId: string, checked: boolean) => void;
  onPriceRangeChange: (groupId: string, range: PriceRange) => void;
  onClearFilters: () => void;
}

export const SideFilters: React.FC<SideFiltersProps> = ({
  filterGroups,
  activeFilters,
  activePriceRanges,
  onFilterChange,
  onPriceRangeChange,
  onClearFilters,
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setExpandedGroups({
      ...expandedGroups,
      [groupId]: !expandedGroups[groupId],
    });
  };

  // Formata o preço para exibição
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TbAdjustmentsHorizontal className="mr-2 text-amber-600" size={20} />
          <h2 className="text-lg font-medium text-gray-800">Filtros</h2>
        </div>
        {Object.keys(activeFilters).length > 0 && (
          <button 
            className="text-sm text-amber-600 hover:text-amber-800 hover:underline"
            onClick={onClearFilters}
          >
            Limpar tudo
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {filterGroups.map((group) => (
          <div key={group.id} className="py-4">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => toggleGroup(group.id)}
            >
              <h3 className="text-md font-medium text-gray-800">{group.title}</h3>
              {expandedGroups[group.id] ? (
                <FiChevronUp className="text-gray-500" />
              ) : (
                <FiChevronDown className="text-gray-500" />
              )}
            </button>

            {(expandedGroups[group.id] !== false) && (
              <div className="mt-3 ml-1">
                {group.type === 'checkbox' && group.options && (
                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${group.id}-${option.id}`}
                          checked={
                            activeFilters[group.id]?.includes(option.id) || false
                          }
                          onChange={(e) =>
                            onFilterChange(group.id, option.id, e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                        />
                        <label
                          htmlFor={`${group.id}-${option.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {option.label}
                          {option.count !== undefined && (
                            <span className="ml-1 text-gray-500">({option.count})</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {group.type === 'radio' && group.options && (
                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`${group.id}-${option.id}`}
                          name={group.id}
                          checked={
                            activeFilters[group.id]?.includes(option.id) || false
                          }
                          onChange={(e) =>
                            onFilterChange(group.id, option.id, e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                        />
                        <label
                          htmlFor={`${group.id}-${option.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {group.type === 'range' && group.priceRange && (
                  <div className="space-y-4 mt-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        {formatPrice(activePriceRanges[group.id]?.min || group.priceRange.min)}
                      </span>
                      <span>
                        {formatPrice(activePriceRanges[group.id]?.max || group.priceRange.max)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={group.priceRange.min}
                        max={group.priceRange.max}
                        value={activePriceRanges[group.id]?.min || group.priceRange.min}
                        onChange={(e) =>
                          onPriceRangeChange(group.id, {
                            min: parseInt(e.target.value),
                            max:
                              activePriceRanges[group.id]?.max || group.priceRange.max,
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={group.priceRange.min}
                        max={group.priceRange.max}
                        value={activePriceRanges[group.id]?.max || group.priceRange.max}
                        onChange={(e) =>
                          onPriceRangeChange(group.id, {
                            min:
                              activePriceRanges[group.id]?.min || group.priceRange.min,
                            max: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        min={group.priceRange.min}
                        max={group.priceRange.max}
                        value={activePriceRanges[group.id]?.min || ''}
                        onChange={(e) =>
                          onPriceRangeChange(group.id, {
                            min: parseInt(e.target.value) || group.priceRange.min,
                            max:
                              activePriceRanges[group.id]?.max || group.priceRange.max,
                          })
                        }
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        min={group.priceRange.min}
                        max={group.priceRange.max}
                        value={activePriceRanges[group.id]?.max || ''}
                        onChange={(e) =>
                          onPriceRangeChange(group.id, {
                            min:
                              activePriceRanges[group.id]?.min || group.priceRange.min,
                            max: parseInt(e.target.value) || group.priceRange.max,
                          })
                        }
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideFilters; 