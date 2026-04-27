import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { newsSchema, updateNewsSchema } from '../validations/news.validation';
import { upload } from '../middlewares/upload.middleware'; // Import multer

const router = Router();

// Rute Publik
router.get('/', NewsController.list);
router.get('/:slug', NewsController.detail);

// Rute Admin (Dengan penanganan file thumbnail)
router.post(
  '/', 
  requireAuth, 
  upload.single('thumbnail'), // Tangkap file bernama 'thumbnail'
  validate(newsSchema), 
  NewsController.create
);

router.put(
  '/:id', 
  requireAuth, 
  upload.single('thumbnail'), // Thumbnail bersifat opsional saat update
  validate(updateNewsSchema), 
  NewsController.update
);

router.delete('/:id', requireAuth, NewsController.delete);

export default router;