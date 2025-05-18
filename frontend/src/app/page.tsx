'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight, FaChevronLeft, FaStar, FaShoppingCart, FaHeart, FaTag, FaChevronDown, FaTruck, FaShieldAlt, FaCreditCard, FaHeadset } from 'react-icons/fa';

// Interface estendida para o tipo User com a propriedade role opcional
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

// Dados simulados para produtos em destaque
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

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    console.log('Home - Auth state:', { isAuthenticated, isLoading });
    
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('Home - User authenticated, redirecting to landing page');
        router.push('/landingpage');
      } else {
        console.log('Home - User not authenticated, redirecting to login');
        router.push('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Renderiza tela de carregamento enquanto verifica autenticação
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Inicializando...</p>
      </div>
    </div>
  );
}
