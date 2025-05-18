'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import axios from 'axios';
import { UserData } from '@/services/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profilePicture?: string;
  companyName?: string;
  isSeller?: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
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
    console.log('AuthContext - Initial useEffect running');
    
    const loadUser = async () => {
      try {
        console.log('AuthContext - Loading user data...');
        
        // Verificar se estamos no navegador
        if (typeof window !== 'undefined') {
          console.log('AuthContext - Running in browser environment');
          
          // Primeiro tentar carregar do cache local
          if (checkAuthFromCache()) {
            console.log('AuthContext - Using cached authentication data');
            setIsLoading(false);
            return;
          }
          
          const token = localStorage.getItem('token');
          console.log('AuthContext - Token from localStorage:', token ? 'Found' : 'Not found');
          
          if (token) {
            // Verificar se o token está expirado antes de fazer chamada à API
            if (isTokenExpired(token)) {
              console.log('AuthContext - Token is expired, removing');
              localStorage.removeItem('token');
              setIsLoading(false);
              return;
            }
            
            console.log('AuthContext - Token found and valid, fetching user data from API');
            // Buscar dados do usuário atual da API com timeout
            try {
              // Criar um CancelToken para o timeout
              const source = axios.CancelToken.source();
              const timeoutId = setTimeout(() => {
                source.cancel('Timeout - API não respondeu em 60 segundos');
              }, 60000); // 60 segundos

              const response = await api.get('/users/me', {
                cancelToken: source.token
              });
              
              // Limpar o timeout se a resposta chegou
              clearTimeout(timeoutId);
              
              console.log('AuthContext - User data received:', response.data);
              
              // Verificar se os dados retornados são válidos
              if (response.data && response.data.data && response.data.data.user) {
                const userData = response.data.data.user;
                setUser(userData);
                setIsAuthenticated(true);
                setConnectionError(null);
                
                // Salvar dados no cache local
                saveAuthToCache(token, userData);
                console.log('AuthContext - Authentication data saved to cache');
              } else {
                console.error('AuthContext - Invalid user data format:', response.data);
                throw new Error('Formato de dados inválido recebido do servidor');
              }
            } catch (apiError: any) {
              console.error('AuthContext - Error fetching user data:', apiError);
              
              // Verificar se é um erro de timeout ou de conexão
              if (axios.isCancel(apiError) || apiError.code === 'ERR_NETWORK') {
                console.error('AuthContext - Network error or timeout:', apiError.message);
                
                // Verificar se existe um usuário em modo de desenvolvimento para testes de UI
                if (process.env.NODE_ENV === 'development' && window.location.pathname.includes('/profile')) {
                  console.log('AuthContext - Creating a test user for UI development');
                  
                  const testUser = {
                    id: '1',
                    name: 'Usuário de Teste',
                    email: 'teste@example.com',
                    role: 'user',
                    isActive: true,
                    isSeller: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  };
                  
                  setUser(testUser);
                  setIsAuthenticated(true);
                  setConnectionError('Utilizando dados de teste para desenvolvimento. O backend está indisponível.');
                  setIsLoading(false);
                  return; // Saia da função sem remover o token
                }
                
                setConnectionError('O servidor está demorando para responder. Tente novamente mais tarde.');
                clearAuthCache();
              } else {
                throw apiError;
              }
            }
          } else {
            console.log('AuthContext - No token found, user not authenticated');
          }
        } else {
          console.log('AuthContext - Running in server environment, skipping auth check');
        }
      } catch (error: any) {
        console.error('AuthContext - Error loading user:', error);
        
        // Verificar se é um erro de conexão
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          console.error('AuthContext - Network connection error:', error.code);
          setConnectionError('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
        } else if (error.response && error.response.status === 401) {
          // Token inválido ou expirado
          console.error('AuthContext - Authentication error (401)');
          clearAuthCache();
          setConnectionError('Sua sessão expirou. Por favor, faça login novamente.');
        } else {
          console.error('AuthContext - Unknown error:', error);
          setConnectionError('Ocorreu um erro ao carregar seus dados. Tente novamente mais tarde.');
        }
        
        // Em caso de erro, limpar os dados de autenticação
        clearAuthCache();
      } finally {
        console.log('AuthContext - Finished loading user, setting isLoading to false');
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Função para atualizar os dados do usuário no contexto
  const updateUserData = (userData: Partial<User>) => {
    console.log('AuthContext - Updating user data:', userData);
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
      console.log('AuthContext - Refreshing user data');
      
      setConnectionError(null);
      
      console.log('AuthContext - Fetching fresh user data from API');
      const response = await api.get('/users/me');
      console.log('AuthContext - Received refreshed user data:', response.data);
      
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      return response.data.data.user;
    } catch (error: any) {
      console.error('AuthContext - Error refreshing user data:', error);
      
      // Verificar se é um erro de conexão
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        console.error('AuthContext - Network connection error during refresh:', error.code);
        setConnectionError('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      } else if (error.response && error.response.status === 401) {
        // Token inválido ou expirado
        console.error('AuthContext - Authentication error during refresh (401)');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setConnectionError('Sua sessão expirou. Por favor, faça login novamente.');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        console.error('AuthContext - Unknown error during refresh:', error);
        setConnectionError('Ocorreu um erro ao carregar seus dados. Tente novamente mais tarde.');
      }
      
      throw error;
    }
  };

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext - Attempting login for email:', email);
      setConnectionError(null);
      
      // Chamar API de login
      const response = await api.post('/auth/login', { email, password });
      console.log('AuthContext - Login successful, received data:', response.data);
      
      // Verificar se a resposta contém token
      if (!response.data || !response.data.token) {
        throw new Error('Resposta inválida do servidor: token não encontrado');
      }
      
      const token = response.data.token;
      
      // Verificar se a resposta contém dados do usuário
      if (response.data.data && response.data.data.user) {
        const userData = response.data.data.user;
        
        // Salvar no cache com timestamp atual
        saveAuthToCache(token, userData);
        console.log('AuthContext - Authentication data saved to cache');
        
        setUser(userData);
        setIsAuthenticated(true);
        console.log('AuthContext - User data set and authenticated');
      } else {
        console.error('AuthContext - User data missing from response');
        throw new Error('Dados de usuário ausentes na resposta');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('AuthContext - Login error:', error);
      
      // Verificar se é um erro de conexão
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        console.error('AuthContext - Network error during login:', error.code);
        setConnectionError('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      } else if (error.response && error.response.status === 401) {
        console.error('AuthContext - Invalid credentials (401)');
        setConnectionError('Email ou senha incorretos.');
      } else {
        console.error('AuthContext - Unknown login error:', error);
        setConnectionError(error.message || 'Ocorreu um erro ao fazer login. Tente novamente mais tarde.');
      }
      
      throw error;
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('AuthContext - Attempting to register user:', { name, email });
      setConnectionError(null);
      // Chamar API de registro
      const response = await api.post('/auth/register', { name, email, password });
      console.log('AuthContext - Registration successful, received data:', response.data);
      
      // Salvar token no localStorage
      if (typeof window !== 'undefined' && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error: any) {
      console.error('AuthContext - Registration error:', error);
      
      // Verificar se é um erro de conexão
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        console.error('AuthContext - Network error during registration:', error.code);
        setConnectionError('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      } else if (error.response && error.response.status === 409) {
        console.error('AuthContext - Email already in use (409)');
        setConnectionError('Este email já está em uso. Tente outro ou faça login.');
      } else {
        console.error('AuthContext - Unknown registration error:', error);
        setConnectionError('Ocorreu um erro ao fazer o cadastro. Tente novamente mais tarde.');
      }
      
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    console.log('AuthContext - Logging out user');
    clearAuthCache();
    setUser(null);
    setIsAuthenticated(false);
    setConnectionError(null);
    window.location.href = '/login';
  };

  // Adicionar esse método para verificar se o token está expirado
  const isTokenExpired = (token: string): boolean => {
    try {
      // Extrair payload do JWT (segunda parte do token)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const { exp } = JSON.parse(jsonPayload);
      // Verificar se expirou (exp é em segundos, Date.now() em milissegundos)
      return exp * 1000 < Date.now();
    } catch (error) {
      // Se houver qualquer erro no parsing do token, considerar como expirado
      console.error('AuthContext - Error parsing token:', error);
      return true;
    }
  };

  // Função para verificar se o usuário está autenticado usando cache local
  const checkAuthFromCache = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('userData');
    const authTimestamp = localStorage.getItem('authTimestamp');
    
    // Se não tem token ou dados, não está autenticado
    if (!token || !userDataStr || !authTimestamp) return false;
    
    // Verificar se o token expirou
    if (isTokenExpired(token)) {
      console.log('AuthContext - Cached token is expired');
      clearAuthCache();
      return false;
    }
    
    // Verificar se passaram-se mais de 3 horas desde a autenticação
    const lastAuthTime = parseInt(authTimestamp, 10);
    const threeHoursMs = 3 * 60 * 60 * 1000;
    
    if (Date.now() - lastAuthTime > threeHoursMs) {
      console.log('AuthContext - Auth cache is older than 3 hours');
      clearAuthCache();
      return false;
    }
    
    try {
      // Se chegou aqui, o token é válido e os dados estão em cache
      const userData = JSON.parse(userDataStr);
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('AuthContext - Error parsing cached user data:', error);
      clearAuthCache();
      return false;
    }
  };
  
  // Função para limpar o cache de autenticação
  const clearAuthCache = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('authTimestamp');
  };
  
  // Função para salvar dados de autenticação no cache
  const saveAuthToCache = (token: string, userData: User) => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('authTimestamp', Date.now().toString());
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