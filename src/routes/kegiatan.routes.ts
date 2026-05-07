import { Router } from 'express';
import { KegiatanController } from '../controllers/kegiatan.controller';
import { upload } from '../middlewares/upload.middleware';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Rute Publik
router.get('/', KegiatanController.list);
router.get('/:id', KegiatanController.detail);

// Rute Admin
router.post('/', requireAuth, upload.single('image'), KegiatanController.create);
router.put('/:id', requireAuth, upload.single('image'), KegiatanController.update);
router.delete('/:id', requireAuth, KegiatanController.delete);

export default router;
