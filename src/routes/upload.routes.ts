import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Endpoint ini akan dipakai oleh Tiptap dan form Thumbnail
router.post('/image', requireAuth, upload.single('image'), UploadController.uploadImage);

export default router;