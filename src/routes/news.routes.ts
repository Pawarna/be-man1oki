import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';
import { validate } from '../middlewares/validate.middleware';
import { getNewsQuerySchema, newsSchema, updateNewsSchema } from '../validations/news.validation';
import { upload } from '../middlewares/upload.middleware';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Rute Publik
router.get('/', validate(getNewsQuerySchema), NewsController.list);
router.get('/:id', NewsController.detail);

// Rute Admin (Dengan penanganan file image)
router.post(
  '/', 
  requireAuth,
  upload.single('image'),
  validate(newsSchema), 
  NewsController.create
);

router.put(
  '/:id', 
  requireAuth,
  upload.single('image'),
  validate(updateNewsSchema), 
  NewsController.update
);

router.delete('/:id', requireAuth, NewsController.delete);

export default router;