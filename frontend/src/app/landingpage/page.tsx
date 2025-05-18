'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight, FaStar, FaShoppingCart, FaHeart, FaTag, FaTruck, FaShieldAlt, FaCreditCard, FaHeadset } from 'react-icons/fa';

const featuredProducts = [
  {
    id: 1,
    name: 'Fogão Industrial 6 Bocas de Alta Pressão',
    price: 1899.90,
    originalPrice: 2299.90,
    image: '/images/restaurante.png',
    rating: 4.8,
    reviews: 156,
    freeShipping: true,
    discount: 17,
    seller: 'Equipamentos Pro',
    installments: 12,
  },
  {
    id: 2,
    name: 'Fritadeira Elétrica Comercial 10L Inox',
    price: 699.90,
    originalPrice: 849.90,
    image: '/images/restaurante.png',
    rating: 4.6,
    reviews: 98,
    freeShipping: true,
    discount: 18,
    seller: 'Kitchen Solutions',
    installments: 10,
  },
  {
    id: 3,
    name: 'Refrigerador Comercial 4 Portas Inox 1000L',
    price: 5699.90,
    originalPrice: 6499.90,
    image: '/images/restaurante.png',
    rating: 4.9,
    reviews: 75,
    freeShipping: true,
    discount: 12,
    seller: 'Refrigeração Total',
    installments: 12,
  },
  {
    id: 4,
    name: 'Liquidificador Industrial 8L Alta Rotação',
    price: 549.90,
    originalPrice: 649.90,
    image: '/images/restaurante.png',
    rating: 4.7,
    reviews: 112,
    freeShipping: true,
    discount: 15,
    seller: 'Equipamentos Pro',
    installments: 8,
  },
  {
    id: 5,
    name: 'Chapa para Lanches a Gás 80cm',
    price: 899.90,
    originalPrice: 1099.90,
    image: '/images/restaurante.png',
    rating: 4.5,
    reviews: 87,
    freeShipping: true,
    discount: 18,
    seller: 'Cozinha Industrial',
    installments: 10,
  },
];

// Categorias populares
const categories = [
  { id: 1, name: 'Fogões Industriais', icon: '🔥', slug: 'fogoes-industriais', count: 128 },
  { id: 2, name: 'Refrigeração', icon: '❄️', slug: 'refrigeracao', count: 94 },
  { id: 3, name: 'Fornos', icon: '🍞', slug: 'fornos', count: 76 },
  { id: 4, name: 'Chapas e Fritadeiras', icon: '🍳', slug: 'chapas-fritadeiras', count: 65 },
  { id: 5, name: 'Liquidificadores', icon: '🥤', slug: 'liquidificadores', count: 42 },
  { id: 6, name: 'Utensílios', icon: '🍽️', slug: 'utensilios', count: 213 },
];

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('LandingPage - Auth state:', { isAuthenticated, isLoading });
    
    // Só redirecionar se não estiver carregando e não estiver autenticado
    if (!isLoading && !isAuthenticated) {
      console.log('LandingPage - Not authenticated, redirecting to login');
      router.push('/login');
    } else if (!isLoading && isAuthenticated) {
      console.log('LandingPage - User authenticated, showing content');
    }
  }, [isLoading, isAuthenticated, router]);

  // Mostra tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizamos nada (router.push vai redirecionar)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        {/* Banner principal aprimorado */}
        <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-md">
          {/* Imagem do banner */}
          <Image
            src="/images/banner.png"
            alt="Equipamentos para Restaurantes"
            fill
            className="object-cover z-0"
            priority
            sizes="100vw"
            quality={100}
          />
          
          {/* Sobreposição sutil para garantir legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
          
          {/* Conteúdo do banner */}
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container mx-auto px-6 md:px-12">
              <div className="max-w-lg">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-sm">
                  Ofertas Imperdíveis
                </h1>
                <p className="text-xl text-white/90 mb-6 drop-shadow-sm">
                  Até 30% OFF em Equipamentos para Restaurantes
                </p>
                <Link 
                  href="/ofertas" 
                  className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors shadow-md"
                >
                  Ver ofertas
                  <FaChevronRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Categorias populares */}
        <div className="bg-white rounded-xl shadow-md p-8 relative overflow-hidden">
          {/* Efeito de fundo decorativo */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-100 rounded-full opacity-30"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-200 rounded-full opacity-20"></div>
          
          <div className="relative">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Categorias Populares</h2>
                <p className="text-gray-500">Encontre os melhores equipamentos por categoria</p>
              </div>
              <Link href="/categorias" className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors border border-amber-200">
                Ver todas
                <FaChevronRight className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link 
                  href={`/categoria/${category.slug}`} 
                  key={category.id}
                  className="flex flex-col items-center p-6 bg-white hover:bg-amber-50 rounded-xl transition-all duration-300 border border-gray-100 hover:border-amber-200 group hover:shadow-md relative overflow-hidden"
                >
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-200/0 via-amber-200/30 to-amber-200/0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                  
                  <div className="bg-amber-100 text-4xl p-5 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 relative">
                    <span>{category.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 text-center group-hover:text-amber-700 transition-colors mb-1">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {category.count} produtos
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Benefícios e vantagens */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-md p-8 text-white relative overflow-hidden">
          {/* Efeitos decorativos */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative">
            <h2 className="text-3xl font-bold mb-8 text-center">Por que escolher a RevMak?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="bg-white text-amber-600 p-4 rounded-full mb-4 shadow-lg">
                  <FaTruck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
                <p className="text-white/80">Entregamos em todo o Brasil com rapidez e segurança. Frete grátis em compras acima de R$ 2.000.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="bg-white text-amber-600 p-4 rounded-full mb-4 shadow-lg">
                  <FaShieldAlt className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Garantia Estendida</h3>
                <p className="text-white/80">Todos os produtos com garantia de fábrica e opção de garantia estendida de até 3 anos.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="bg-white text-amber-600 p-4 rounded-full mb-4 shadow-lg">
                  <FaCreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pagamento Facilitado</h3>
                <p className="text-white/80">Parcele em até 12x sem juros ou obtenha 10% de desconto no pagamento à vista.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="bg-white text-amber-600 p-4 rounded-full mb-4 shadow-lg">
                  <FaHeadset className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Suporte Especializado</h3>
                <p className="text-white/80">Equipe técnica especializada para ajudar na escolha e instalação dos equipamentos.</p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link 
                href="/sobre" 
                className="inline-flex items-center bg-white text-amber-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-amber-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Saiba mais sobre nós
                <FaChevronRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Produtos em destaque */}
        <div className="bg-white rounded-xl shadow-md p-8 relative overflow-hidden">
          {/* Efeito de fundo decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full opacity-30 -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Produtos em Destaque</h2>
                <p className="text-gray-500">Os equipamentos mais procurados com os melhores preços</p>
              </div>
              <Link href="/produtos" className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors border border-amber-200">
                Ver todos
                <FaChevronRight className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
                  {/* Badge de desconto */}
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-md z-10 shadow-md">
                      {product.discount}% OFF
                    </div>
                  )}
                  
                  <div className="relative pt-[100%] bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Botões de ação */}
                    <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white hover:bg-amber-50 text-amber-700 p-2.5 rounded-full shadow-md hover:shadow-lg transition-all">
                        <FaHeart className="w-4 h-4" />
                      </button>
                      <button className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all">
                        <FaShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Barra de progresso para produtos com estoque limitado (simulado) */}
                    {product.id === 2 && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/80 backdrop-blur-sm">
                        <div className="text-xs text-red-600 font-medium mb-1">Restam poucas unidades!</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    {/* Frete grátis */}
                    <div className="flex justify-between items-center mb-2">
                      {product.freeShipping && (
                        <div className="text-green-600 text-xs font-medium flex items-center">
                          <FaTag className="mr-1" /> Frete grátis
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Vendido por: {product.seller}
                      </div>
                    </div>
                    
                    <Link href={`/produto/${product.id}`} className="block">
                      <h3 className="text-sm text-gray-700 font-medium line-clamp-2 hover:text-amber-700 mb-2 transition-colors h-10">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Avaliações */}
                    <div className="flex items-center mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                    
                    {/* Preços */}
                    <div className="mb-2">
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-500 line-through">
                          R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                      <div className="text-xl font-bold text-gray-900">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </div>
                      <div className="text-xs text-gray-600">
                        em até {product.installments}x de R$ {(product.price / product.installments).toFixed(2).replace('.', ',')} sem juros
                      </div>
                    </div>
                    
                    {/* Botão de compra */}
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-md flex items-center justify-center font-medium transition-colors mt-3 group-hover:shadow-md">
                      <FaShoppingCart className="mr-2" />
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
} 