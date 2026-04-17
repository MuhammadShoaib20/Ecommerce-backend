import express from 'express';
import { submitContact, getAllContacts, deleteContact } from '../controllers/contactController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/contact', submitContact);

// Admin routes
router.get('/admin/contacts', isAuthenticatedUser, authorizeRoles('admin'), getAllContacts);
router.delete('/admin/contact/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteContact);

export default router;