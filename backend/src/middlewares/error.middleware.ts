import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';

// Interface para erros personalizados
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para lidar com erros de validação do Sequelize
const handleSequelizeValidationError = (err: ValidationError) => {
  const errors = err.errors.map((error) => error.message);
  const message = `Dados inválidos. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Middleware para lidar com erros de duplicação no Sequelize
const handleSequelizeUniqueConstraintError = (err: any) => {
  const field = err.errors[0]?.path || 'campo';
  const message = `Valor duplicado para ${field}. Por favor, use outro valor.`;
  return new AppError(message, 400);
};

// Middleware para lidar com erros de JWT
const handleJWTError = () =>
  new AppError('Token inválido. Por favor, faça login novamente.', 401);

// Middleware para lidar com erros de expiração do JWT
const handleJWTExpiredError = () =>
  new AppError('Seu token expirou. Por favor, faça login novamente.', 401);

// Enviar erros em ambiente de desenvolvimento
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Enviar erros em ambiente de produção
const sendErrorProd = (err: AppError, res: Response) => {
  // Erros operacionais, confiáveis: enviar mensagem para o cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } 
  // Erros de programação ou outros erros desconhecidos: não vazar detalhes
  else {
    // Log do erro
    console.error('ERROR 💥', err);

    // Enviar mensagem genérica
    res.status(500).json({
      status: 'error',
      message: 'Algo deu errado!',
    });
  }
};

// Middleware global de tratamento de erros
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'SequelizeValidationError') error = handleSequelizeValidationError(error);
    if (error.name === 'SequelizeUniqueConstraintError') error = handleSequelizeUniqueConstraintError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
}; 