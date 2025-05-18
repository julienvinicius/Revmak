import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { createSendToken } from '../utils/jwt.util';
import { AppError } from '../middlewares/error.middleware';

// Registrar um novo usuário
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Backend - register: Request received', { 
      body: req.body, 
      ip: req.ip 
    });
    
    const { name, email, password } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await User.findOne({
      where: { email }
    });
    
    if (existingUser) {
      console.log('Backend - register: Email already in use', { email });
      return next(new AppError('Este email já está em uso', 400));
    }

    console.log('Backend - register: Creating new user', { name, email });
    
    // Criar novo usuário
    try {
      const newUser = await User.create({
        name,
        email,
        password,
        role: 'user',     // Campo obrigatório que estava faltando
        isActive: true    // Campo obrigatório que estava faltando
      });
      
      console.log('Backend - register: User created successfully', { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email 
      });

      // Enviar token JWT
      createSendToken(newUser, 201, res);
    } catch (createError: any) {
      console.error('Backend - register: Error creating user', { 
        error: createError.message,
        stack: createError.stack,
        details: createError.errors 
      });
      throw createError;
    }
  } catch (error) {
    console.error('Backend - register: Unhandled error', { 
      error: (error as Error).message,
      stack: (error as Error).stack
    });
    next(error);
  }
};

// Login de usuário
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Backend - login: Request received', { 
      body: { email: req.body.email }, // Não logar a senha
      ip: req.ip 
    });
    
    const { email, password } = req.body;

    // Verificar se email e senha foram fornecidos
    if (!email || !password) {
      console.log('Backend - login: Missing email or password');
      return next(new AppError('Por favor, forneça email e senha', 400));
    }

    // Verificar se o usuário existe e a senha está correta
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      console.log('Backend - login: User not found', { email });
      return next(new AppError('Email ou senha incorretos', 401));
    }
    
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      console.log('Backend - login: Incorrect password', { email });
      return next(new AppError('Email ou senha incorretos', 401));
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      console.log('Backend - login: Inactive user account', { email });
      return next(new AppError('Esta conta foi desativada', 401));
    }

    console.log('Backend - login: Successful login', { 
      id: user.id, 
      email: user.email 
    });
    
    // Enviar token JWT
    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Backend - login: Unhandled error', { 
      error: (error as Error).message,
      stack: (error as Error).stack
    });
    next(error);
  }
};

// Logout de usuário
export const logout = (req: Request, res: Response) => {
  console.log('Backend - logout: User logged out');
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// Obter usuário atual
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Backend - getCurrentUser: Returning current user data', { 
      userId: req.user?.id
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error('Backend - getCurrentUser: Unhandled error', { 
      error: (error as Error).message,
      stack: (error as Error).stack
    });
    next(error);
  }
};

// Atualizar senha
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Backend - updatePassword: Request received', { 
      userId: req.user?.id
    });
    
    const { currentPassword, newPassword } = req.body;

    // Verificar se as senhas foram fornecidas
    if (!currentPassword || !newPassword) {
      console.log('Backend - updatePassword: Missing current or new password');
      return next(
        new AppError('Por favor, forneça a senha atual e a nova senha', 400)
      );
    }

    // Obter o usuário com a senha
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('Backend - updatePassword: User not found', { userId: req.user?.id });
      return next(new AppError('Usuário não encontrado', 404));
    }

    // Verificar se a senha atual está correta
    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      console.log('Backend - updatePassword: Incorrect current password', { userId: req.user?.id });
      return next(new AppError('Senha atual incorreta', 401));
    }

    // Atualizar a senha
    user.password = newPassword;
    await user.save();
    
    console.log('Backend - updatePassword: Password updated successfully', { userId: req.user?.id });

    // Enviar novo token JWT
    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Backend - updatePassword: Unhandled error', { 
      error: (error as Error).message,
      stack: (error as Error).stack
    });
    next(error);
  }
}; 