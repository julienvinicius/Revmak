import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

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
  try {
    let token;

    // Verificar se o token existe no header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Pegar o token do header
      token = req.headers.authorization.split(' ')[1];
    } 
    // Verificar se o token existe nos cookies
    else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // Verificar se o token existe
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Você não está autenticado. Por favor, faça login.',
      });
    }

    // Verificar se o token é válido
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || 'seu-segredo-super-secreto'
    );

    // Verificar se o usuário ainda existe
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'O usuário não existe mais.',
      });
    }

    // Verificar se o usuário está ativo
    if (!currentUser.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Esta conta foi desativada.',
      });
    }

    // Adicionar o usuário ao request
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado.',
    });
  }
};

// Middleware para verificar permissões de usuário
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Você não está autenticado. Por favor, faça login.',
      });
    }

    // Verificar se o usuário tem permissão
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para realizar esta ação.',
      });
    }

    next();
  };
}; 