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
    const { name, email, password } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await User.findOne({
      where: { email }
    });
    
    if (existingUser) {
      return next(new AppError('Este email já está em uso', 400));
    }

    // Criar novo usuário
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // Enviar token JWT
    createSendToken(newUser, 201, res);
  } catch (error) {
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
    const { email, password } = req.body;

    // Verificar se email e senha foram fornecidos
    if (!email || !password) {
      return next(new AppError('Por favor, forneça email e senha', 400));
    }

    // Verificar se o usuário existe e a senha está correta
    const user = await User.findOne({
      where: { email }
    });

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Email ou senha incorretos', 401));
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return next(new AppError('Esta conta foi desativada', 401));
    }

    // Enviar token JWT
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Logout de usuário
export const logout = (req: Request, res: Response) => {
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
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
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
    const { currentPassword, newPassword } = req.body;

    // Verificar se as senhas foram fornecidas
    if (!currentPassword || !newPassword) {
      return next(
        new AppError('Por favor, forneça a senha atual e a nova senha', 400)
      );
    }

    // Obter o usuário com a senha
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return next(new AppError('Usuário não encontrado', 404));
    }

    // Verificar se a senha atual está correta
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Senha atual incorreta', 401));
    }

    // Atualizar a senha
    user.password = newPassword;
    await user.save();

    // Enviar novo token JWT
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
}; 