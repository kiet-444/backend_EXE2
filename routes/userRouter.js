// routes/user.routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User.controller');
const { verifyToken, isAdmin, isUserOrAdmin } = require('../middleWare/auth.middleware');

// Update user profile (accessible by user or admin)
router.put('/update/:id', verifyToken, isUserOrAdmin, UserController.updateUser);

// Delete user (admin only)
router.delete('/delete/:id', verifyToken, isAdmin, UserController.deleteUser);

// Get all users (admin only)
router.get('/all', verifyToken, isAdmin, UserController.getAllUsers);

module.exports = router;
