import { Router } from 'express';
import { GaleriController } from '../controllers/galeri.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { galeriSchema, updateGaleriSchema } from '../validations/galeri.validation';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Rute Publik
router.get('/', GaleriController.list);
router.get('/:id', GaleriController.detail);

// Rute Admin
router.post(
  '/', 
  requireAuth, 
  upload.single('url'), // Sesuai spesifikasi 'url' di OpenAPI
  validate(galeriSchema), 
  GaleriController.create
);

router.put(
  '/:id', 
  requireAuth, 
  upload.single('url'), 
  validate(updateGaleriSchema), 
  GaleriController.update
);

router.delete('/:id', requireAuth, GaleriController.delete);

export default router;