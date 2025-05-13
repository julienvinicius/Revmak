'use client';

import { useEffect } from 'react';
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
  
  // Tratar o usuário como ExtendedUser
  const extendedUser = user as ExtendedUser | null;

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (
      requireAuth &&
      isAuthenticated &&
      allowedRoles.length > 0 &&
      extendedUser &&
      !allowedRoles.includes(extendedUser.role || '')
    ) {
      // Redirecionar para página de acesso negado
      router.push('/unauthorized');
      return;
    }

    // Se não requer autenticação, mas o usuário está autenticado (ex: página de login)
    if (!requireAuth && isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isLoading, isAuthenticated, requireAuth, allowedRoles, router, pathname, extendedUser]);

  // Mostrar nada enquanto verifica autenticação
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // Se requer autenticação e o usuário não está autenticado, não renderize nada
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Se não requer autenticação e o usuário está autenticado, não renderize nada
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 