import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { categorySchema } from '../validations/category.validation';

const router = Router();

// ==========================================
// 🌍 RUTE PUBLIK
// ==========================================
router.get('/', CategoryController.list);
router.get('/:id', CategoryController.detail);

// ==========================================
// 🔒 RUTE ADMIN (Dashboard CMS)
// ==========================================
router.post('/', requireAuth, validate(categorySchema), CategoryController.create);
router.put('/:id', requireAuth, validate(categorySchema), CategoryController.update);
router.delete('/:id', requireAuth, CategoryController.delete);

export default router;