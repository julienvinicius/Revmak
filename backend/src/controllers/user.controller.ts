import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { AppError } from '../middlewares/error.middleware';

// Obter todos os usuários
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Obter um usuário pelo ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new AppError('Usuário não encontrado', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar dados do usuário
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Não permitir atualização de senha por esta rota
    if (req.body.password) {
      return next(
        new AppError(
          'Esta rota não é para atualização de senha. Por favor, use /updatePassword',
          400
        )
      );
    }

    // Filtrar campos não permitidos
    const filteredBody: any = {};
    const allowedFields = ['name', 'email'];
    
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        filteredBody[field] = req.body[field];
      }
    });

    // Atualizar usuário
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return next(new AppError('Usuário não encontrado', 404));
    }
    
    await user.update(filteredBody);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Desativar conta de usuário (soft delete)
export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return next(new AppError('Usuário não encontrado', 404));
    }
    
    await user.update({ isActive: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Atualizar qualquer usuário
export const adminUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Filtrar campos não permitidos
    const filteredBody: any = {};
    const allowedFields = ['name', 'email', 'role', 'isActive'];
    
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        filteredBody[field] = req.body[field];
      }
    });

    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return next(new AppError('Usuário não encontrado', 404));
    }
    
    await user.update(filteredBody);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Excluir usuário permanentemente
export const adminDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new AppError('Usuário não encontrado', 404));
    }
    
    await user.destroy();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}; 