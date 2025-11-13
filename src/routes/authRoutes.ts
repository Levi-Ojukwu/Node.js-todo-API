import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import upload from '../utils/uploader';
import { requireAuth } from '../middleware/auth';

const router = Router();


router.post ("/register", upload.single("image"), register);
router.post ("/login", login);
router.get ("/profile", requireAuth, getProfile);
router.patch ("/profile", requireAuth, upload.single("image"), updateProfile);

export default router