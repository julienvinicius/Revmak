import React from 'react';
import ProductCard from './ProductCard';
import { BsFillGridFill, BsList } from 'react-icons/bs';
import { BiLoader } from 'react-icons/bi';

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

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error?: string;
  viewType?: 'grid' | 'list';
  onViewTypeChange?: (viewType: 'grid' | 'list') => void;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  loading, 
  error, 
  viewType = 'grid',
  onViewTypeChange 
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BiLoader className="animate-spin text-amber-600 mb-4" size={48} />
        <p className="text-gray-600">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 my-4 text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum produto encontrado</h3>
        <p className="text-gray-600">
          Tente ajustar seus filtros ou termos de busca para encontrar o que procura.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controles de visualização */}
      {onViewTypeChange && (
        <div className="flex justify-end border-b border-gray-200 pb-3">
          <div className="flex space-x-2">
            <button
              className={`p-2 rounded-md ${
                viewType === 'grid'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => onViewTypeChange('grid')}
              aria-label="Visualização em grade"
            >
              <BsFillGridFill size={18} />
            </button>
            <button
              className={`p-2 rounded-md ${
                viewType === 'list'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => onViewTypeChange('list')}
              aria-label="Visualização em lista"
            >
              <BsList size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Lista de produtos */}
      <div 
        className={`
          ${viewType === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
            : 'space-y-4'
          }
        `}
      >
        {products.map((product) => (
          <div 
            key={product.id}
            className={`relative ${viewType === 'list' ? 'w-full' : ''}`}
          >
            {viewType === 'list' ? (
              <div className="flex bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden">
                <div className="relative w-1/4 min-w-[150px]">
                  <div className="relative w-full h-full min-h-[200px]">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{product.category}</span>
                    <span className="text-xs font-medium text-amber-700">{product.brand}</span>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      {product.oldPrice && (
                        <p className="text-xs text-gray-500 line-through">{product.oldPrice}</p>
                      )}
                      <p className="text-xl font-bold text-amber-600">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(product.price)}
                      </p>
                    </div>
                    <button className="mt-2 md:mt-0 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-medium py-2 px-4 rounded-md shadow transition-colors duration-300">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <ProductCard product={product} />
            )}
          </div>
        ))}
      </div>

      {/* Paginação ou botão "Carregar mais" pode ser adicionado aqui */}
    </div>
  );
};

export default ProductList; 