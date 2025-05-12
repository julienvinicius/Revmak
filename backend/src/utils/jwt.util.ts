import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../interfaces/user.interface';

// Função para criar um token JWT
export const generateToken = (id: number): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'seu-segredo-super-secreto',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Função para criar e enviar um token JWT como cookie
export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const token = generateToken(user.id);

  // Configurar cookie
  const cookieOptions: any = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  // Enviar cookie
  res.cookie('jwt', token, cookieOptions);

  // Remover a senha da saída
  const userObj = user.toJSON();
  delete userObj.password;

  // Enviar resposta
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userObj,
    },
  });
}; 