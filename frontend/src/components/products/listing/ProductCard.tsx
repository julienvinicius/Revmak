import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaStar, FaRegStar } from 'react-icons/fa';
import { MdGridView } from 'react-icons/md';
import { CiDeliveryTruck } from 'react-icons/ci';

interface ProductCardProps {
  product: {
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
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-amber-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-amber-500" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      {/* Badge para produtos em destaque ou novos */}
      {(product.featuredLabel || product.isNew) && (
        <div className="absolute top-3 left-3 z-10">
          {product.featuredLabel && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md mr-2">
              {product.featuredLabel}
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Novo
            </span>
          )}
        </div>
      )}
      
      {/* Botão de favorito */}
      <div className="absolute top-3 right-3 z-10">
        <button 
          className="bg-white rounded-full p-2 shadow-md hover:bg-amber-50 transition-colors"
          aria-label="Adicionar aos favoritos"
        >
          <FaHeart className="text-gray-400 hover:text-amber-500" />
        </button>
      </div>
      
      {/* Imagem do produto */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <div className="w-full h-full transition-transform duration-300 hover:scale-105">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      </div>
      
      {/* Conteúdo do card */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Categoria e marca */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{product.category}</span>
          <span className="text-xs font-medium text-amber-700">{product.brand}</span>
        </div>
        
        {/* Nome do produto */}
        <Link href={`/product/${product.id}`} className="mb-2 hover:text-amber-600">
          <h3 className="font-medium text-gray-800 line-clamp-2 h-12" title={product.name}>
            {product.name}
          </h3>
        </Link>
        
        {/* Avaliações */}
        <div className="flex items-center mb-3">
          <div className="flex mr-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="mt-auto">
          {/* Preço */}
          <div className="mb-3">
            {product.oldPrice && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
            <p className="text-xl font-bold text-amber-600">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice && (
              <p className="text-xs text-green-600 font-medium">
                {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
              </p>
            )}
          </div>

          {/* Disponibilidade e entrega */}
          <div className="flex flex-col space-y-1 mb-3 text-xs">
            {product.inStock ? (
              <span className="text-green-600 flex items-center">
                <MdGridView className="mr-1" /> Em estoque
              </span>
            ) : (
              <span className="text-red-500">Sem estoque</span>
            )}
            
            {product.freeShipping && (
              <span className="text-gray-700 flex items-center">
                <CiDeliveryTruck className="mr-1" /> Frete grátis
              </span>
            )}
          </div>

          {/* Botão de compra */}
          <button 
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-medium py-2 px-4 rounded-md shadow transition-colors duration-300"
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 