'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserData: (userData: Partial<User>) => void;
  refreshUserData: () => Promise<void>;
  connectionError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const router = useRouter();

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Verificar se estamos no navegador antes de acessar localStorage
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            // Buscar dados do usuário atual da API
            const response = await api.get('/users/me');
            setUser(response.data);
            setIsAuthenticated(true);
            setConnectionError(null);
          }
        }
      } catch (error: any) {
        console.error('Erro ao carregar usuário:', error);
        
        // Verificar se é um erro de conexão
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          setConnectionError('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
        } else if (error.response && error.response.status === 401) {
          // Token inválido ou expirado
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          setConnectionError('Sua sessão expirou. Por favor, faça login novamente.');
        } else {
          setConnectionError('Ocorreu um erro ao carregar seus dados. Tente novamente mais tarde.');
        }
        
        // Em caso de erro, limpar os dados de autenticação
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Função para atualizar os dados do usuário no contexto
  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...userData
      });
    }
  };
  
  // Função para recarregar os dados do usuário a partir da API
  const refreshUserData = async () => {
    try {
      setConnectionError(null);
      const response = await api.get('/users/me');
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao recarregar dados do usuário:', error);
      
      // Verificar se é um erro de conexão
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        setConnectionError('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      } else if (error.response && error.response.status === 401) {
        // Token inválido ou expirado
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setConnectionError('Sua sessão expirou. Por favor, faça login novamente.');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setConnectionError('Ocorreu um erro ao carregar seus dados. Tente novamente mais tarde.');
      }
      
      throw error;
    }
  };

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setConnectionError(null);
      // Chamar API de login
      const response = await api.post('/auth/login', { email, password });
      
      // Salvar token no localStorage
      if (typeof window !== 'undefined' && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      // Verificar se é um erro de conexão
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        setConnectionError('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      } else if (error.response && error.response.status === 401) {
        setConnectionError('Email ou senha incorretos.');
      } else {
        setConnectionError('Ocorreu um erro ao fazer login. Tente novamente mais tarde.');
      }
      
      throw error;
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string) => {
    try {
      setConnectionError(null);
      // Chamar API de registro
      const response = await api.post('/auth/register', { name, email, password });
      
      // Salvar token no localStorage
      if (typeof window !== 'undefined' && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      
      // Verificar se é um erro de conexão
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        setConnectionError('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      } else if (error.response && error.response.status === 409) {
        setConnectionError('Este email já está em uso. Tente outro ou faça login.');
      } else {
        setConnectionError('Ocorreu um erro ao fazer o cadastro. Tente novamente mais tarde.');
      }
      
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setIsAuthenticated(false);
    setConnectionError(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register,
      logout,
      isLoading,
      updateUserData,
      refreshUserData,
      connectionError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 