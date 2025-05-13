'use client';

import React from 'react';
import AuthGuard from '../auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Interface estendida para o tipo User com a propriedade role opcional
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
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
  // Tratar o usuário como ExtendedUser
  const extendedUser = user as ExtendedUser | null;

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <AuthGuard requireAuth={true} allowedRoles={allowedRoles}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Revmak</Link>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="hover:text-blue-200">Início</Link>
              {extendedUser?.role === 'admin' && (
                <Link href="/admin" className="hover:text-blue-200">Admin</Link>
              )}
            </nav>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="hover:text-blue-200">
                    Perfil
                  </Link>
                  <span>Olá, {extendedUser?.name || extendedUser?.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        
        <footer className="bg-gray-100 p-4">
          <div className="container mx-auto text-center text-gray-600">
            &copy; {new Date().getFullYear()} Revmak. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
} 