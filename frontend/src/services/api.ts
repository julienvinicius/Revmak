import axios from 'axios';

// Simple in-memory cache system
const cache = new Map();
const cacheTTL = 5 * 60 * 1000; // 5 minutes

// Function to get cached data if valid
const getFromCache = (url) => {
  const cachedData = cache.get(url);
  if (!cachedData) return null;
  
  // Check if cache is expired
  if (Date.now() - cachedData.timestamp > cacheTTL) {
    cache.delete(url);
    return null;
  }
  
  return cachedData.data;
};

// Function to store data in cache
const setInCache = (url, data) => {
  cache.set(url, {
    data,
    timestamp: Date.now()
  });
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

console.log('API Service - Initializing with URL:', API_URL);

// Aumentar o tempo limite para 60 segundos para APIs lentas
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 60000, // 60 segundos
  // Configurar retry automático
  validateStatus: (status) => {
    // Rejeitar apenas quando o status for >= 500 (erros do servidor)
    return status < 500;
  }
});

// Interceptor para adicionar o token JWT às requisições
api.interceptors.request.use(
  async (config) => {
    // Verificar se estamos no navegador
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`API Service - Adding token to request: ${config.method?.toUpperCase()} ${config.url}`);
      } else {
        console.log(`API Service - No token available for request: ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      // Para performance: Adicionar um identificador de cache para permitir invalidação manual
      config.headers['Cache-Control'] = config.method?.toLowerCase() === 'get' 
        ? 'public, max-age=300' // 5 minutos para GETs
        : 'no-cache, no-store';
      
      // Apply cache for GET requests
      if (config.method?.toLowerCase() === 'get' && config.url) {
        const fullUrl = config.baseURL + config.url;
        const cachedData = getFromCache(fullUrl);
        
        if (cachedData) {
          console.log(`API Service - Using cached data for: ${config.method.toUpperCase()} ${config.url}`);
          // Create a canceled request with cached data
          config.adapter = () => {
            return Promise.resolve({
              data: cachedData,
              status: 200,
              statusText: 'OK',
              headers: config.headers,
              config: config,
              request: { fromCache: true }
            });
          };
        }
      }
    }
    return config;
  },
  (error) => {
    console.error('API Service - Request error interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    console.log(`API Service - Response success: ${response.config.method?.toUpperCase()} ${response.config.url}`, 
      { status: response.status, data: response.data });
      
    // Cache GET responses if not from cache already
    if (response.config.method?.toLowerCase() === 'get' && !response.request.fromCache) {
      const fullUrl = response.config.baseURL + response.config.url;
      setInCache(fullUrl, response.data);
      console.log(`API Service - Cached response for: ${response.config.method.toUpperCase()} ${response.config.url}`);
    }
    
    // Adicionar cache manual para endpoints específicos que podem precisar de acesso rápido
    if (response.config.url?.includes('/users/me') && typeof window !== 'undefined') {
      localStorage.setItem('user-data-cache', JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));
    }
    
    return response;
  },
  (error) => {
    // Log detalhado do erro
    if (error.response) {
      // Resposta do servidor com código de erro
      console.error('API Service - Response error:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('API Service - Network error: No response received', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        error: error.message
      });
      
      // Tentar obter dados do cache para falhas de rede
      if (error.config?.url?.includes('/users/me') && typeof window !== 'undefined') {
        const cachedData = localStorage.getItem('user-data-cache');
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            const cacheAge = Date.now() - parsedData.timestamp;
            
            // Usar cache apenas se tiver menos de 1 hora
            if (cacheAge < 60 * 60 * 1000) {
              console.log('API Service - Returning cached user data due to network error');
              // Criar um erro personalizado com os dados em cache
              error.cachedData = parsedData.data;
            }
          } catch (e) {
            console.error('API Service - Error parsing cached data:', e);
          }
        }
      }
    } else {
      // Erro durante a configuração da requisição
      console.error('API Service - Request setup error:', error.message);
    }

    // Tratar erros 401 (não autorizado)
    if (error.response && error.response.status === 401) {
      // Se estamos no navegador, redirecionar para login
      if (typeof window !== 'undefined') {
        console.log('API Service - Unauthorized access (401), redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Método para limpar cache específico
api.clearCache = (url) => {
  if (url) {
    cache.delete(url);
    console.log(`API Service - Cache cleared for ${url}`);
  }
};

// Método para limpar todo o cache
api.clearAllCache = () => {
  cache.clear();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user-data-cache');
    console.log('API Service - All cache cleared');
  }
};

export default api; 