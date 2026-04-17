import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateProfile,
  updatePassword
  ,
  devToken
} from '../controllers/authController.js';
import { isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/logout', isAuthenticatedUser, logoutUser);
router.get('/profile', isAuthenticatedUser, getUserProfile);
router.put('/profile/update', isAuthenticatedUser, updateProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword);

// Dev-only route to get a test JWT (creates user if needed)
// Controlled by ENABLE_DEV_ROUTES environment variable (set to 'true' to enable)
if (process.env.ENABLE_DEV_ROUTES === 'true') {
  router.post('/dev-token', devToken);
  console.warn('Dev auth route `/api/auth/dev-token` is enabled (ENABLE_DEV_ROUTES=true)');
}

export default router;
