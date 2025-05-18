'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Interface estendida para o tipo User com a propriedade role opcional
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export default function AuthGuard({
  children,
  requireAuth = true,
  allowedRoles = [],
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Tratar o usuário como ExtendedUser
  const extendedUser = user as ExtendedUser | null;

  // Usar memo para evitar cálculos repetidos de permissão
  const hasRequiredRole = useMemo(() => {
    if (!extendedUser || allowedRoles.length === 0) return true;
    return allowedRoles.includes(extendedUser.role || '');
  }, [extendedUser, allowedRoles]);

  console.log('AuthGuard - Debug Info:', { 
    isLoading, 
    isAuthenticated, 
    requireAuth, 
    pathname,
    hasUser: !!user,
    userRole: extendedUser?.role,
    hasRequiredRole,
    isRedirecting
  });

  useEffect(() => {
    console.log('AuthGuard - useEffect running');
    
    // Evitar redirecionamentos repetidos
    if (isRedirecting) return;
    
    if (isLoading) {
      console.log('AuthGuard - Still loading, returning early');
      return;
    }

    if (requireAuth && !isAuthenticated) {
      console.log('AuthGuard - Authentication required but not authenticated, redirecting to login');
      setIsRedirecting(true);
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireAuth && isAuthenticated && !hasRequiredRole) {
      // Redirecionar para página de acesso negado
      console.log('AuthGuard - User does not have required role, redirecting to unauthorized');
      setIsRedirecting(true);
      router.push('/unauthorized');
      return;
    }

    // Se não requer autenticação, mas o usuário está autenticado (ex: página de login)
    if (!requireAuth && isAuthenticated) {
      console.log('AuthGuard - Already authenticated but on non-auth page, redirecting to home');
      setIsRedirecting(true);
      router.push('/landingpage');
      return;
    }
    
    console.log('AuthGuard - All checks passed');
  }, [
    isLoading, 
    isAuthenticated, 
    requireAuth, 
    hasRequiredRole, 
    router, 
    pathname, 
    isRedirecting
  ]);

  // Cache local para evitar tela de carregamento em páginas já verificadas
  const cachedLocal = useMemo(() => {
    if (typeof window !== 'undefined') {
      const cachedPages = localStorage.getItem('authVerifiedPages');
      if (cachedPages) {
        try {
          const pages = JSON.parse(cachedPages);
          return pages.includes(pathname);
        } catch (e) {
          return false;
        }
      }
    }
    return false;
  }, [pathname]);

  // Salvar nas páginas já verificadas
  useEffect(() => {
    if (!isLoading && !isRedirecting && typeof window !== 'undefined') {
      try {
        const cachedPages = localStorage.getItem('authVerifiedPages');
        const pages = cachedPages ? JSON.parse(cachedPages) : [];
        
        if (!pages.includes(pathname)) {
          pages.push(pathname);
          localStorage.setItem('authVerifiedPages', JSON.stringify(pages));
        }
      } catch (e) {
        console.error('Error saving verified pages cache:', e);
      }
    }
  }, [isLoading, isRedirecting, pathname]);

  // Mostrar indicador de carregamento enquanto verifica autenticação, exceto para páginas já verificadas
  if (isLoading && !cachedLocal) {
    console.log('AuthGuard - Rendering loading indicator');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  // Se estiver redirecionando, mostrar indicador de redirecionamento
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se requer autenticação e o usuário não está autenticado, não renderize nada
  if (requireAuth && !isAuthenticated) {
    console.log('AuthGuard - Not rendering due to missing authentication');
    return null;
  }

  // Se não requer autenticação e o usuário está autenticado, não renderize nada
  if (!requireAuth && isAuthenticated) {
    console.log('AuthGuard - Not rendering auth page for authenticated user');
    return null;
  }

  console.log('AuthGuard - Rendering children');
  return <>{children}</>;
} 