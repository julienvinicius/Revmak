'use client';

import React, { useState, useEffect } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { BsBox2, BsStarFill, BsGrid, BsLightningCharge, BsShieldCheck } from 'react-icons/bs';
import { FaTruck, FaPercent, FaRegClock } from 'react-icons/fa';
import { MdRestaurant, MdKitchen, MdOutlineRestaurant } from 'react-icons/md';

// Importar componentes do arquivo de índice
import { 
  Breadcrumb, 
  FilterBar, 
  SearchBar, 
  SideFilters, 
  ProductList 
} from '@/components/products/listing';

// Importar tipos
import type { BreadcrumbItem } from '@/components/products/listing/Breadcrumb';
import type { FilterOption } from '@/components/products/listing/FilterBar';
import type { FilterGroup } from '@/components/products/listing/SideFilters';

// Tipos de dados
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  freeShipping?: boolean;
  featuredLabel?: string;
  isNew?: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

// Opções de filtro rápido
const quickFilterOptions: FilterOption[] = [
  { id: 'promocao', label: 'Promoção', icon: <FaPercent /> },
  { id: 'fogoes', label: 'Fogões', icon: <MdKitchen /> },
  { id: 'novidades', label: 'Novidades', icon: <BsLightningCharge /> },
  { id: 'freteGratis', label: 'Frete Grátis', icon: <FaTruck /> },
  { id: 'mais-vendidos', label: 'Mais Vendidos', icon: <BsStarFill /> },
  { id: 'garantia', label: 'Garantia Estendida', icon: <BsShieldCheck /> },
  { id: 'pronta-entrega', label: 'Pronta Entrega', icon: <FaRegClock /> },
];

// Grupos de filtro lateral
const filterGroups: FilterGroup[] = [
  {
    id: 'category',
    title: 'Categorias',
    type: 'checkbox',
    options: [
      { id: 'fogoes', label: 'Fogões', count: 125 },
      { id: 'fornos', label: 'Fornos', count: 87 },
      { id: 'refrigeradores', label: 'Refrigeradores', count: 56 },
      { id: 'liquidificadores', label: 'Liquidificadores', count: 43 },
      { id: 'batedeiras', label: 'Batedeiras', count: 38 },
      { id: 'utilidades', label: 'Utensílios de Cozinha', count: 120 },
    ],
  },
  {
    id: 'brand',
    title: 'Marcas',
    type: 'checkbox',
    options: [
      { id: 'tramontina', label: 'Tramontina', count: 87 },
      { id: 'consul', label: 'Consul', count: 64 },
      { id: 'brastemp', label: 'Brastemp', count: 53 },
      { id: 'electrolux', label: 'Electrolux', count: 49 },
      { id: 'progás', label: 'Progás', count: 38 },
      { id: 'venancio', label: 'Venâncio', count: 32 },
    ],
  },
  {
    id: 'price',
    title: 'Faixa de Preço',
    type: 'range',
    priceRange: {
      min: 0,
      max: 10000,
      current: { min: 0, max: 10000 },
    },
  },
  {
    id: 'rating',
    title: 'Avaliação',
    type: 'radio',
    options: [
      { id: '4+', label: '4 estrelas ou mais' },
      { id: '3+', label: '3 estrelas ou mais' },
      { id: '2+', label: '2 estrelas ou mais' },
      { id: '1+', label: '1 estrela ou mais' },
    ],
  },
];

// Opções de ordenação
const sortOptions = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'rating', label: 'Melhor avaliados' },
];

// Produtos simulados
const mockProducts: Product[] = Array.from({ length: 16 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  name: `Equipamento para Restaurante ${i + 1} - Modelo Profissional`,
  image: `https://placehold.co/400x300?text=Produto+${i + 1}`,
  price: Math.round((500 + Math.random() * 4500) * 100) / 100,
  oldPrice: Math.random() > 0.5 ? Math.round((700 + Math.random() * 5000) * 100) / 100 : undefined,
  rating: Math.round((3 + Math.random() * 2) * 10) / 10,
  reviewCount: Math.floor(Math.random() * 100) + 1,
  category: ['Fogões', 'Fornos', 'Refrigeradores', 'Liquidificadores'][Math.floor(Math.random() * 4)],
  brand: ['Tramontina', 'Consul', 'Brastemp', 'Electrolux'][Math.floor(Math.random() * 4)],
  inStock: Math.random() > 0.2,
  freeShipping: Math.random() > 0.5,
  featuredLabel: Math.random() > 0.8 ? 'Destaque' : undefined,
  isNew: Math.random() > 0.7,
}));

export default function ProductsPage() {
  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activePriceRanges, setActivePriceRanges] = useState<Record<string, PriceRange>>({});
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [currentSort, setCurrentSort] = useState('relevance');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Breadcrumb simulado
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Produtos', href: '/produtos' },
  ];

  // Carregar produtos (simulado)
  useEffect(() => {
    // Simulando uma chamada de API
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Gerenciar filtros
  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setActiveFilters((prev) => {
      const current = prev[groupId] || [];
      if (filterGroups.find((g) => g.id === groupId)?.type === 'radio') {
        return {
          ...prev,
          [groupId]: checked ? [optionId] : [],
        };
      }
      
      if (checked && !current.includes(optionId)) {
        return {
          ...prev,
          [groupId]: [...current, optionId],
        };
      } else if (!checked) {
        return {
          ...prev,
          [groupId]: current.filter((id) => id !== optionId),
        };
      }
      
      return prev;
    });
  };

  const handlePriceRangeChange = (groupId: string, range: PriceRange) => {
    setActivePriceRanges((prev) => ({
      ...prev,
      [groupId]: range,
    }));
  };

  const handleQuickFilterToggle = (filterId: string) => {
    setQuickFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setActivePriceRanges({});
    setQuickFilters([]);
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} currentPage="Equipamentos para Restaurante" />
        
        {/* Barra de busca e ordenação */}
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={() => console.log('Buscando:', searchQuery)}
          sortOptions={sortOptions}
          currentSort={currentSort}
          onSortChange={(sort) => setCurrentSort(sort)}
          resultsCount={products.length}
          categoryName="Equipamentos para Restaurante"
        />
        
        {/* Filtros rápidos */}
        <FilterBar
          options={quickFilterOptions}
          activeFilters={quickFilters}
          onFilterToggle={handleQuickFilterToggle}
          showMobileFilters={() => setShowMobileFilters(true)}
        />
        
        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filtros laterais (desktop) */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <SideFilters
                  filterGroups={filterGroups}
                  activeFilters={activeFilters}
                  activePriceRanges={activePriceRanges}
                  onFilterChange={handleFilterChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearFilters={clearAllFilters}
                />
              </div>
            </div>
            
            {/* Listagem de produtos */}
            <div className="flex-grow">
              <ProductList
                products={products}
                loading={loading}
                error={error}
                viewType={viewType}
                onViewTypeChange={setViewType}
              />
            </div>
          </div>
        </div>
        
        {/* Filtros laterais (mobile) */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex md:hidden">
            <div className="bg-white w-4/5 h-full overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-medium">Filtros</h2>
                <button
                  className="text-gray-500"
                  onClick={() => setShowMobileFilters(false)}
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <SideFilters
                  filterGroups={filterGroups}
                  activeFilters={activeFilters}
                  activePriceRanges={activePriceRanges}
                  onFilterChange={handleFilterChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearFilters={clearAllFilters}
                />
              </div>
              <div className="p-4 border-t sticky bottom-0 bg-white">
                <button
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
} 