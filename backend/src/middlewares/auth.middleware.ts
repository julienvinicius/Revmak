import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import NodeCache from 'node-cache';

// Cache para armazenar usuários por 5 minutos
const userCache = new NodeCache({
  stdTTL: 300, // 5 minutos
  checkperiod: 60, // verificar expiração a cada 1 minuto
  useClones: false // para economizar memória, não clonar objetos
});

// Estendendo a interface Request do Express para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  try {
    console.log('Auth Middleware - protect: Processing request', { 
      path: req.path, 
      method: req.method,
      hasAuthHeader: !!req.headers.authorization,
      hasCookies: !!req.cookies
    });
    
    let token;

    // Verificar se o token existe no header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Pegar o token do header
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth Middleware - protect: Found token in Authorization header');
    } 
    // Verificar se o token existe nos cookies
    else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log('Auth Middleware - protect: Found token in cookies');
    }

    // Verificar se o token existe
    if (!token) {
      console.log('Auth Middleware - protect: No token found');
      return res.status(401).json({
        status: 'error',
        message: 'Você não está autenticado. Por favor, faça login.',
      });
    }

    console.log('Auth Middleware - protect: Verifying token');
    
    // Verificar se o token é válido
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'seu-segredo-super-secreto'
      );
      
      console.log('Auth Middleware - protect: Token verified successfully', { 
        userId: decoded.id,
        exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'unknown'
      });

      // Verificar se o usuário está no cache
      const cacheKey = `user_${decoded.id}`;
      let currentUser = userCache.get(cacheKey);
      
      if (!currentUser) {
        console.log('Auth Middleware - protect: User not in cache, finding in database');
        // Verificar se o usuário ainda existe
        currentUser = await User.findByPk(decoded.id);
        
        if (currentUser) {
          // Armazenar no cache para futuras requisições
          userCache.set(cacheKey, currentUser);
        }
      } else {
        console.log('Auth Middleware - protect: User found in cache');
      }
      
      if (!currentUser) {
        console.log('Auth Middleware - protect: User not found in database');
        return res.status(401).json({
          status: 'error',
          message: 'O usuário não existe mais.',
        });
      }

      // Verificar se o usuário está ativo
      if (!currentUser.isActive) {
        console.log('Auth Middleware - protect: User account is inactive');
        // Remover do cache se não estiver mais ativo
        userCache.del(cacheKey);
        return res.status(401).json({
          status: 'error',
          message: 'Esta conta foi desativada.',
        });
      }

      const responseTime = Date.now() - startTime;
      console.log('Auth Middleware - protect: Authentication successful', {
        userId: currentUser.id,
        role: currentUser.role,
        responseTimeMs: responseTime
      });
      
      // Adicionar o usuário ao request
      req.user = currentUser;
      next();
    } catch (jwtError) {
      console.error('Auth Middleware - protect: JWT verification failed', {
        error: (jwtError as Error).message
      });
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido ou expirado.',
      });
    }
  } catch (error) {
    console.error('Auth Middleware - protect: Unexpected error', {
      error: (error as Error).message,
      stack: (error as Error).stack
    });
    
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado.',
    });
  }
};

// Função para limpar o cache do usuário
export const clearUserCache = (userId: number) => {
  userCache.del(`user_${userId}`);
  console.log(`Auth Middleware - Cache cleared for user ${userId}`);
};

// Middleware para verificar permissões de usuário
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('Auth Middleware - restrictTo: Checking permissions', {
      userRole: req.user?.role,
      requiredRoles: roles
    });
    
    if (!req.user) {
      console.log('Auth Middleware - restrictTo: No authenticated user found');
      return res.status(401).json({
        status: 'error',
        message: 'Você não está autenticado. Por favor, faça login.',
      });
    }

    // Verificar se o usuário tem permissão
    if (!roles.includes(req.user.role)) {
      console.log('Auth Middleware - restrictTo: Permission denied');
      return res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para realizar esta ação.',
      });
    }

    console.log('Auth Middleware - restrictTo: Permission granted');
    next();
  };
}; 