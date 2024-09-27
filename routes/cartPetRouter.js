const express = require('express');
const router = express.Router();
const CartPetController = require('../controllers/CartPet.controllers');
const { verifyToken, isAdmin } = require('../middleWare/auth.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartPet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the cart item
 *         petId:
 *           type: string
 *           description: The ID of the product
 *         quantity:
 *           type: integer
 *           description: The quantity of the product in the cart
 *         status:
 *           type: string
 *           description: The status of the cart item
 *         addedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the item was added to the cart
 *       required:
 *         - petId
 *         - quantity
 *       example:
 *         id: 1
 *         petId: 1
 *         quantity: 2
 *         status: pending
 *         addedAt: 2022-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/cart-pets:
 *   get:
 *     summary: Get all cart pets
 *     tags: [CartPet]
 *     responses:
 *       200:
 *         description: All cart pets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartPet'
 *       500:
 *         description: Failed to get cart pets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 error:
 *                   type: string
 *                   description: The error code
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 error:
 *                   type: string
 *                   description: The error code
 */

/**
 * @swagger
 * /api/cart-pets:
 *   post:
 *     summary: Add a pet to cart
 *     tags: [CartPet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: string
 *                 description: The ID of the product
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product
 *             required:
 *               - petId
 *               - quantity
 *     responses:
 *       201:
 *         description: Pet added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CartPet'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 error:
 *                   type: string
 *                   description: The error code
 */

/**
 * @swagger
 * /api/cart-pets/{id}:
 *   get:
 *     summary: Get details of a cart pet
 *     tags: [CartPet]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart pet to retrieve
 *     responses:
 *       200:
 *         description: Cart pet details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CartPet'
 *       404:
 *         description: Cart pet not found
 */

/**
 * @swagger
 * /api/cart-pets/{id}:
 *   patch:
 *     summary: Update status of a cart pet
 *     tags: [CartPet]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart pet to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the cart pet
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Cart pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CartPet'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 error:
 *                   type: string
 *                   description: The error code
 */

/**
 * @swagger
 * /api/cart-pets/{id}:
 *   delete:
 *     summary: Remove a cart pet
 *     tags: [CartPet]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart pet to delete
 *     responses:
 *       200:
 *         description: Cart pet removed successfully
 *       404:
 *         description: Cart pet not found
 *       500:
 *         description: Failed to remove cart pet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 error:
 *                   type: string
 *                   description: The error code
 * */

router.get('/', verifyToken, CartPetController.getCartPets);
router.post('/', verifyToken, CartPetController.addPetToCart);
router.patch('/', verifyToken, isAdmin, CartPetController.updateStatusCartPet);
router.delete('/:id', verifyToken, CartPetController.deleteCartPet);
router.get('/:id', verifyToken, CartPetController.getCartPetDetail);
module.exports = router;
