'use client';

import React, { useState } from 'react';
import AuthGuard from '../auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaBell, FaShoppingCart, FaUserCircle, FaHeart, FaList, FaSignOutAlt, FaTags, FaMapMarkerAlt } from 'react-icons/fa';

// Interface estendida para o tipo User com propriedades opcionais adicionais
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isSeller?: boolean;
}

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedLayout({
  children,
  allowedRoles = [],
}: ProtectedLayoutProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Tratar o usuário como ExtendedUser
  const extendedUser = user as ExtendedUser | null;

  const handleSignOut = async () => {
    await logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando por:', searchQuery);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <AuthGuard requireAuth={true} allowedRoles={allowedRoles}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-gradient-to-r from-[#452b18] to-[#5d402a] text-white py-2 px-4 shadow-md">
          <div className="container mx-auto flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <div className="relative mr-2">
                  <span className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                    Rev<span className="text-amber-400">Mak</span>
                  </span>
                </div>
              </Link>
              
              <form onSubmit={handleSearch} className="flex-1 mx-6 max-w-3xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar equipamentos para restaurante..."
                    className="w-full py-2 px-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-amber-500"
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>
              
              <div className="flex items-center space-x-4 text-sm">
                <button className="flex flex-col items-center hover:text-amber-300 transition-colors">
                  <FaBell className="text-xl" />
                  <span className="hidden sm:inline mt-1">Notificações</span>
                </button>
                
                <Link href="/favorites" className="flex flex-col items-center hover:text-amber-300 transition-colors">
                  <FaHeart className="text-xl" />
                  <span className="hidden sm:inline mt-1">Favoritos</span>
                </Link>
                
                <Link href="/cart" className="flex flex-col items-center hover:text-amber-300 transition-colors">
                  <div className="relative">
                    <FaShoppingCart className="text-xl" />
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                  </div>
                  <span className="hidden sm:inline mt-1">Carrinho</span>
                </Link>
                
                <div className="relative">
                  <button 
                    onClick={toggleUserMenu}
                    className="flex flex-col items-center hover:text-amber-300 transition-colors"
                  >
                    <FaUserCircle className="text-xl" />
                    <span className="hidden sm:inline mt-1">
                      {extendedUser?.name?.split(' ')[0] || 'Conta'}
                    </span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-gray-700 font-medium">{extendedUser?.name}</p>
                        <p className="text-gray-500 text-xs truncate">{extendedUser?.email}</p>
                      </div>
                      
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                        <FaUserCircle className="mr-2 text-amber-600" />
                        Meu perfil
                      </Link>
                      
                      <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                        <FaList className="mr-2 text-amber-600" />
                        Meus pedidos
                      </Link>
                      
                      {extendedUser?.role === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                          <FaTags className="mr-2 text-amber-600" />
                          Painel admin
                        </Link>
                      )}
                      
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2 text-amber-600" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-6 text-sm py-1">
              <Link href="/categorias" className="hover:text-amber-300 flex items-center transition-colors">
                <FaList className="mr-1" />
                Categorias
              </Link>
              <Link href="/ofertas" className="hover:text-amber-300 transition-colors">Ofertas</Link>
              <Link href="/novidades" className="hover:text-amber-300 transition-colors">Lançamentos</Link>
              <Link href="/vendedores" className="hover:text-amber-300 transition-colors">Vendedores</Link>
              
              {/* Botão de Anunciar destacado */}
              <Link 
                href="/anunciar" 
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md font-medium flex items-center transition-colors"
              >
                <FaTags className="mr-1" />
                Anunciar
              </Link>
              
              {extendedUser?.isSeller && (
                <Link href="/meus-produtos" className="hover:text-amber-300 flex items-center bg-amber-700/30 px-2 py-0.5 rounded-md transition-colors">
                  <FaTags className="mr-1" />
                  Meus Produtos
                </Link>
              )}
              <Link href="/ajuda" className="hover:text-amber-300 transition-colors">Ajuda</Link>
            </nav>
          </div>
        </header>
        
        <div className="bg-white border-b border-gray-200 py-2 px-4 text-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-1 text-amber-600" />
              <span>Enviar para São Paulo - SP</span>
            </div>
            
            <div className="flex space-x-4 text-gray-600">
              <Link href="/premium" className="hover:text-amber-600 transition-colors">RevMak Premium</Link>
              <Link href="/frete-gratis" className="hover:text-amber-600 transition-colors">Frete Grátis</Link>
              <Link href="/mais-vendidos" className="hover:text-amber-600 transition-colors">Mais Vendidos</Link>
            </div>
          </div>
        </div>
        
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        
        <footer className="bg-gray-100 border-t border-gray-200 py-8 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Sobre RevMak</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><Link href="/sobre" className="hover:text-amber-600 transition-colors">Quem somos</Link></li>
                  <li><Link href="/termos" className="hover:text-amber-600 transition-colors">Termos e condições</Link></li>
                  <li><Link href="/privacidade" className="hover:text-amber-600 transition-colors">Política de privacidade</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Pagamento</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><Link href="/pagamentos" className="hover:text-amber-600 transition-colors">Formas de pagamento</Link></li>
                  <li><Link href="/parcelamento" className="hover:text-amber-600 transition-colors">Parcelamento</Link></li>
                  <li><Link href="/boleto" className="hover:text-amber-600 transition-colors">Boleto bancário</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Atendimento</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><Link href="/contato" className="hover:text-amber-600 transition-colors">Fale conosco</Link></li>
                  <li><Link href="/suporte" className="hover:text-amber-600 transition-colors">Suporte</Link></li>
                  <li><Link href="/reclamacoes" className="hover:text-amber-600 transition-colors">Reclamações</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Redes Sociais</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><Link href="https://facebook.com" className="hover:text-amber-600 transition-colors">Facebook</Link></li>
                  <li><Link href="https://instagram.com" className="hover:text-amber-600 transition-colors">Instagram</Link></li>
                  <li><Link href="https://twitter.com" className="hover:text-amber-600 transition-colors">Twitter</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} RevMak. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
} 