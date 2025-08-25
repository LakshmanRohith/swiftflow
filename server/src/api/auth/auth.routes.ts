// path: server/src/api/auth/auth.routes.ts

import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.validation';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, getMe);

export default router;
