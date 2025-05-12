'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import * as authService from '@/services/auth.service';
import { UserData } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  session: Session | null;
  user: UserData | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status: nextAuthStatus } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>(
    'loading'
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Verificar se há um token no localStorage e buscar o usuário
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (nextAuthStatus === 'authenticated' || token) {
      setStatus('authenticated');
      
      // Se temos um token, buscar o usuário da API
      if (token) {
        authService
          .getCurrentUser()
          .then((userData) => {
            setUser(userData);
          })
          .catch(() => {
            localStorage.removeItem('token');
            setStatus('unauthenticated');
            setUser(null);
          });
      }
    } else if (nextAuthStatus === 'unauthenticated') {
      setStatus('unauthenticated');
      setUser(null);
    }
  }, [nextAuthStatus]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Tentar login na API
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      setStatus('authenticated');
      
      // Também fazer login no NextAuth para manter a sessão
      await nextAuthSignIn('credentials', { 
        email, 
        password,
        redirect: false
      });
      
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      setStatus('unauthenticated');
    }
  };

  const signOut = async () => {
    try {
      // Fazer logout na API
      await authService.logout();
      
      // Também fazer logout no NextAuth
      await nextAuthSignOut({ redirect: false });
      
      setUser(null);
      setStatus('unauthenticated');
      router.push('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      
      // Registrar na API
      const response = await authService.register({ name, email, password });
      setUser(response.data.user);
      setStatus('authenticated');
      
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar');
      setStatus('unauthenticated');
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      
      await authService.updatePassword({ currentPassword, newPassword });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar senha');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        status,
        signIn,
        signOut,
        register,
        updatePassword,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 