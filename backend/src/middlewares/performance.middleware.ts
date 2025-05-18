import { Request, Response, NextFunction } from 'express';

// Interface para rastrear tempos de resposta da API
interface RequestStats {
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

// Armazenar estatísticas de performance
const requestStats: RequestStats[] = [];
const MAX_STATS_LENGTH = 100;

// Middleware para monitorar performance
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Armazenar início da requisição
  const stats: RequestStats = {
    url: req.originalUrl,
    method: req.method,
    startTime
  };
  
  // Função para calcular tempo de resposta ao finalizar
  const endTimer = () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    stats.endTime = endTime;
    stats.duration = duration;
    
    // Adicionar às estatísticas (limitando tamanho do array)
    requestStats.push(stats);
    if (requestStats.length > MAX_STATS_LENGTH) {
      requestStats.shift(); // Remove o mais antigo quando chegar ao limite
    }
    
    // Adicionar tempo de resposta ao cabeçalho
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    // Log de performance
    console.log(`Performance - ${req.method} ${req.originalUrl}: ${duration}ms`);
    
    // Verificar se a requisição foi lenta (mais de 500ms)
    if (duration > 500) {
      console.warn(`Performance - Slow request detected: ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
  };
  
  // Capturar eventos de finalização
  res.on('finish', endTimer);
  res.on('close', endTimer);
  
  // Continuar com a próxima middleware
  next();
};

// Endpoint API para obter estatísticas de performance
export const getPerformanceStats = (req: Request, res: Response) => {
  const stats = {
    totalRequests: requestStats.length,
    averageDuration: requestStats.reduce((sum, req) => sum + (req.duration || 0), 0) / requestStats.length,
    slowestRequests: [...requestStats]
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 5)
      .map(req => ({
        url: req.url,
        method: req.method,
        duration: `${req.duration}ms`
      })),
    recentRequests: [...requestStats]
      .reverse()
      .slice(0, 10)
      .map(req => ({
        url: req.url,
        method: req.method,
        duration: `${req.duration}ms`,
        timestamp: new Date(req.startTime).toISOString()
      }))
  };
  
  res.json({
    status: 'success',
    data: stats
  });
};

// Middleware para adicionar compressão automática das respostas
export const enableCompression = (req: Request, res: Response, next: NextFunction) => {
  // Adicionar cabeçalhos para cache do lado do cliente quando apropriado
  if (req.method === 'GET') {
    // Cache de 5 minutos para requisições GET
    res.setHeader('Cache-Control', 'public, max-age=300');
  } else {
    // Sem cache para métodos que modificam dados
    res.setHeader('Cache-Control', 'no-cache, no-store');
  }
  
  next();
}; 