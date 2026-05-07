import { Router } from 'express';
import { PengumumanController } from '../controllers/pengumuman.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { pengumumanSchema, updatePengumumanSchema } from '../validations/pengumuman.validation';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Rute Publik (Siswa/Tamu dapat melihat pengumuman)
router.get('/', PengumumanController.list);
router.get('/:id', PengumumanController.detail);

// Rute Admin
router.post(
  '/', 
  requireAuth, 
  upload.single('file'), // <-- Frontend harus mengirim file dengan nama form 'file'
  validate(pengumumanSchema), 
  PengumumanController.create
);

router.put(
  '/:id', 
  requireAuth, 
  upload.single('file'), // <-- Tambahkan juga di rute PUT
  validate(updatePengumumanSchema), 
  PengumumanController.update
);
router.delete('/:id', requireAuth, PengumumanController.delete);

export default router;