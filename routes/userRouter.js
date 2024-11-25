// routes/user.routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User.controller');
const { verifyToken, isAdmin, isUserOrAdmin } = require('../middleWare/auth.middleware');

/**
 * swagger
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - address
 *         - phoneNumber
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         username:
 *           type: string
 *           description: The username of the user  
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         address:
 *           type: string
 *           description: The address of the user
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the user
 */




// Update user profile (accessible by user or admin)
/**
* @swagger
* /api/user/update/{id}:
*   put:
*     summary: Update user profile
*     tags: [User]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the user
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: User profile updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       404:
*         description: User not found
*       500:
*         description: Failed to update user profile
*/
router.put('/update/:id', verifyToken, isUserOrAdmin, UserController.updateUser);

// Delete user (admin only)
/**
* @swagger
* /api/user/delete/{id}:
*   delete:
*     summary: Delete a user
*     tags: [User]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the user to delete
*     responses:
*       200:
*         description: User deleted successfully
*       404:
*         description: User not found
*       500:
*         description: Failed to delete user
*/
router.delete('/delete/:id', verifyToken, isAdmin, UserController.deleteUser);

// Get all users (admin only)
/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to retrieve users
 */
router.get('/all', verifyToken, isAdmin, UserController.getAllUsers);

// Get user by ID (user or admin)
/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to retrieve user
 */
router.get('/:id', verifyToken, isUserOrAdmin, UserController.getUserById);

module.exports = router;
