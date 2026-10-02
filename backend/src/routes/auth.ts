import { Router } from 'express';
import { register, login, logout, refreshToken } from '../controllers/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

export default router;