import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { requireAuth } from '../middlewares/auth.middleware';
import { loginSchema } from '../validations/user.validation';

const router = Router();

// Tambahkan rute login di sini
router.post('/login', validate(loginSchema), AuthController.login);

router.get('/dashboard', requireAuth, UserController.getDashboard);

export default router;