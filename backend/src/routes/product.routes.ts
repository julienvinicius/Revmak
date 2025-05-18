import { Router } from 'express';
import productController from '../controllers/product.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas - não requerem autenticação
router.get('/public', productController.listPublic);
router.get('/public/:id', productController.getById);

// Rotas privadas - requerem autenticação
router.use(authMiddleware);

// Rotas para vendedores (gerenciamento de produtos)
router.get('/', productController.listSellerProducts);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.get('/:id', productController.getById);
router.delete('/:id', productController.delete);

export default router; 