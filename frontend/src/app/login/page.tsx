'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaLock, FaExclamationTriangle, FaSync, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import ServerConnectionGuide from '@/components/ui/ServerConnectionGuide';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const router = useRouter();
  const { login, connectionError, refreshUserData } = useAuth();

  // Usar o erro de conexão do AuthContext
  useEffect(() => {
    if (connectionError) {
      setError(connectionError);
    }
  }, [connectionError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await login(email, password);
      console.log('Login bem sucedido, redirecionando...', response);
      
      // Usar router.push em vez de window.location para evitar refresh completo
      router.push('/landingpage');
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      // O erro já foi tratado no AuthContext e definido em connectionError
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    setIsRefreshing(true);
    setError('');
    
    try {
      await refreshUserData();
    } catch (err) {
      // Erro já tratado no AuthContext
    } finally {
      setIsRefreshing(false);
    }
  };

  const isConnectionError = error && error.includes('conectar ao servidor');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1a0d05]">
      {/* Lado esquerdo - Imagem e branding com tema futurista marrom escuro */}
      <div className="hidden md:flex md:w-1/2 bg-[#120805] text-white relative overflow-hidden">
        {/* Efeito de grade futurista */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3a1a0a_1px,transparent_1px),linear-gradient(to_bottom,#3a1a0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Círculos futuristas */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-brown-700/20 to-transparent blur-3xl"></div>
        
        {/* Linhas diagonais futuristas */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-0 w-[200%] h-full rotate-12 bg-gradient-to-b from-amber-500/5 to-transparent"></div>
          <div className="absolute -left-10 top-0 w-[200%] h-full rotate-[20deg] bg-gradient-to-b from-brown-800/10 to-transparent"></div>
        </div>
        
        {/* Efeito de brilho pulsante */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-amber-500/5 to-transparent opacity-70 animate-pulse-slow"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          {/* Logo futurista com efeito de borda brilhante */}
          <div className="mb-16 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-brown-600/30 blur-xl rounded-full"></div>
              <h1 className="relative text-6xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Rev<span className="text-amber-400">Mak</span>
              </h1>
            </div>
            <p className="text-amber-100/80 text-lg mt-2 tracking-wider">EQUIPAMENTOS PARA RESTAURANTES</p>
          </div>
          
          {/* Imagem com efeito futurista */}
          <div className="relative w-full h-96 mb-16 group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-brown-900/30 rounded-xl -m-2 group-hover:bg-amber-500/20 transition-all duration-500"></div>
            <div className="absolute inset-0 rounded-xl shadow-[0_0_40px_5px_rgba(217,119,6,0.15)] group-hover:shadow-[0_0_60px_5px_rgba(217,119,6,0.25)] transition-all duration-500"></div>
            <div className="absolute inset-0 rounded-xl border border-amber-500/10 group-hover:border-amber-500/30 transition-all duration-500"></div>
            
            {/* Efeito de borda brilhante */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-brown-600/30 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
            
            <div className="relative h-full w-full transform group-hover:rotate-y-6 transition-all duration-500 preserve-3d">
              <Image 
                src="/images/restaurante.png" 
                alt="Equipamentos para restaurantes" 
                fill
                className="object-contain rounded-xl p-4 z-10"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Lado direito - Formulário de login com tema futurista */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#1a0d05] px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo para mobile com tema futurista */}
          <div className="md:hidden text-center mb-12">
            <div className="inline-block bg-[#120805] p-8 rounded-2xl shadow-[0_0_30px_rgba(217,119,6,0.15)] mb-4 border border-amber-900/30">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-brown-600/20 blur-xl rounded-full"></div>
                <h1 className="relative text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  Rev<span className="text-amber-400">Mak</span>
                </h1>
              </div>
              <p className="text-amber-100/80 text-sm mt-2 tracking-wider">EQUIPAMENTOS PARA RESTAURANTES</p>
            </div>
          </div>
          
          {/* Card de login com efeito futurista */}
          <div className="bg-[#120805] rounded-2xl shadow-[0_0_40px_rgba(217,119,6,0.1)] p-8 border border-amber-900/30 backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300">
            {/* Efeito de borda brilhante no hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-brown-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
            
            <h2 className="text-2xl font-bold text-amber-100 mb-8 text-center tracking-wide">
              Entrar na sua conta
            </h2>
            
            {error && !isConnectionError && (
              <div className="bg-red-900/20 border border-red-800/30 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                <FaExclamationTriangle className="mr-2 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}
            
            {isConnectionError && (
              <div className="mb-6">
                <div className="bg-red-900/20 border border-red-800/30 text-red-400 px-4 py-3 rounded-lg mb-3 flex items-center">
                  <FaExclamationTriangle className="mr-2 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-medium">{error}</p>
                    <p className="text-sm mt-1 text-red-400/70">O servidor pode estar indisponível ou sua conexão pode estar instável.</p>
                  </div>
                  <button 
                    onClick={handleRetry} 
                    className="ml-auto bg-red-900/30 hover:bg-red-800/40 text-red-400 px-3 py-1 rounded-lg flex items-center flex-shrink-0 transition-colors"
                    disabled={isRefreshing}
                  >
                    <FaSync className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Tentando...' : 'Tentar novamente'}
                  </button>
                </div>
                
                <ServerConnectionGuide />
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-amber-200/80 mb-2 tracking-wide">
                  EMAIL
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-amber-700 group-focus-within:text-amber-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3.5 bg-brown-900/30 border border-amber-900/50 text-amber-100 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-[0_0_10px_rgba(217,119,6,0.1)] placeholder:text-amber-800/50"
                    placeholder="seu@email.com"
                    required
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/5 to-amber-700/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-200/80 mb-2 tracking-wide">
                  SENHA
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-amber-700 group-focus-within:text-amber-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3.5 bg-brown-900/30 border border-amber-900/50 text-amber-100 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-[0_0_10px_rgba(217,119,6,0.1)] placeholder:text-amber-800/50"
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/5 to-amber-700/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                <div className="flex justify-end mt-2">
                  <Link href="/esqueci-senha" className="text-xs text-amber-600/80 hover:text-amber-500 transition-colors">
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>
              
              {/* Botão com efeito futurista */}
              <button
                type="submit"
                disabled={isLoading || isRefreshing}
                className="relative w-full mt-4 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-600 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-10"></div>
                <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-amber-500/40 to-transparent group-hover:w-full transition-all duration-500 ease-out"></div>
                <div className="relative flex items-center justify-center py-3.5 px-4">
                  <span className="text-white font-medium tracking-wide">
                    {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
                  </span>
                  <FaChevronRight className="ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(217,119,6,0.3)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>
            
            <div className="mt-10 text-center">
              <p className="text-sm text-amber-100/50">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-amber-500 hover:text-amber-400 transition-colors">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 