import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas
router.get('/', categoryController.listAll);
router.get('/id/:id', categoryController.getById);
router.get('/slug/:slug', categoryController.getBySlug);

// Rotas privadas (apenas admin)
router.use(authMiddleware);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

export default router; 