import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Rotas protegidas
router.use(protect); // Middleware de proteção para todas as rotas abaixo
router.get('/me', authController.getCurrentUser);
router.patch('/update-password', authController.updatePassword);

export default router; 