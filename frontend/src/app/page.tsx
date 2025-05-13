'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';

// Interface estendida para o tipo User com a propriedade role opcional
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  
  // Tratar o usuário como ExtendedUser
  const extendedUser = user as ExtendedUser | null;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bem-vindo ao Revmak</h1>
        
        {extendedUser && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <p className="text-blue-800">
              Olá, <span className="font-semibold">{extendedUser.name}</span>! Você está logado como{' '}
              <span className="font-semibold">{extendedUser.role === 'admin' ? 'Administrador' : 'Usuário'}</span>.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <p className="text-gray-600">Visualize estatísticas e informações importantes.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Usuários</h2>
            <p className="text-gray-600">Gerencie usuários e permissões.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Configurações</h2>
            <p className="text-gray-600">Configure as opções do sistema.</p>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
