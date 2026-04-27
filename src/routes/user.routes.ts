import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { requireAuth } from '../middlewares/auth.middleware';
import { setupAdminSchema, loginSchema } from '../validations/user.validation';

const router = Router();

router.post('/setup-admin', validate(setupAdminSchema), UserController.setupAdmin);

// Tambahkan rute login di sini
router.post('/login', validate(loginSchema), AuthController.login);

router.get('/dashboard', requireAuth, UserController.getDashboard);

export default router;