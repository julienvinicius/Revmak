'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

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
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se ainda estiver carregando, não faça nada
    if (status === 'loading') return;

    // Se requer autenticação e o usuário não está autenticado
    if (requireAuth && status !== 'authenticated') {
      // Redirecionar para login, salvando a página atual para redirecionamento após login
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Se o usuário está autenticado, mas não tem permissão para acessar a página
    if (
      requireAuth &&
      status === 'authenticated' &&
      allowedRoles.length > 0 &&
      user?.role &&
      !allowedRoles.includes(user.role)
    ) {
      // Redirecionar para página de acesso negado
      router.push('/unauthorized');
      return;
    }

    // Se não requer autenticação, mas o usuário está autenticado (ex: página de login)
    if (!requireAuth && status === 'authenticated') {
      router.push('/');
      return;
    }
  }, [status, requireAuth, allowedRoles, router, pathname, user]);

  // Mostrar nada enquanto verifica autenticação
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // Se requer autenticação e o usuário não está autenticado, não renderize nada
  if (requireAuth && status !== 'authenticated') {
    return null;
  }

  // Se não requer autenticação e o usuário está autenticado, não renderize nada
  if (!requireAuth && status === 'authenticated') {
    return null;
  }

  return <>{children}</>;
} 