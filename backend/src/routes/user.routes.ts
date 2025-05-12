import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Proteger todas as rotas
router.use(protect);

// Rotas para usuários normais
router.get('/me', userController.getUserById);
router.patch('/update-me', userController.updateUser);
router.delete('/delete-me', userController.deleteAccount);

// Rotas para administradores
router.use(restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.adminUpdateUser);
router.delete('/:id', userController.adminDeleteUser);

export default router; 