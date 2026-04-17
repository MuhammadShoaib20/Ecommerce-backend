import express from 'express';
import { getAllUsers, deleteUser, updateUserRole } from '../controllers/userController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);
router.put('/admin/user/:id/role', isAuthenticatedUser, authorizeRoles('admin'), updateUserRole);

export default router;