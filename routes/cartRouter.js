const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartItem.controllers');
const { verifyToken } = require('../middleWare/auth.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the cart item
 *         userId:
 *           type: string
 *           description: The ID of the user
 *         productId:
 *           type: string
 *           description: The ID of the product
 *         quantity:
 *           type: integer
 *           description: The quantity of the product in the cart
 *         addedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the item was added to the cart
 *       required:
 *         - userId
 *         - productId
 *         - quantity
 *       example:
 *         id: "64d2e2b8f5e3e57e79d2c5f6"
 *         userId: "64d2e2b8f5e3e57e79d2c5f7"
 *         productId: "64d2e2b8f5e3e57e79d2c5f8"
 *         quantity: 3
 *         addedAt: "2024-08-20T08:49:42.855Z"
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *               productId:
 *                 type: string
 *                 description: The ID of the product
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to add
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Failed to add item to cart
 */
router.post('/add', verifyToken, CartController.addCartItem);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update a cart item
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the cart item to update
 *               quantity:
 *                 type: integer
 *                 description: The updated quantity of the product in the cart
 *             required:
 *               - id
 *               - quantity
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Failed to update cart item
 */
router.put('/update', verifyToken, CartController.updateCartItem);

/**
 * @swagger
 * /api/cart/delete:
 *   delete:
 *     summary: Remove a cart item
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the cart item to delete
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Failed to remove cart item
 */
router.delete('/delete/:id', verifyToken, CartController.deleteCartItem);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all cart items for a user
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of all cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Failed to get cart items
 */
router.get('/', verifyToken, CartController.getAllCartItems);

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Get details of a cart item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart item to retrieve
 *     responses:
 *       200:
 *         description: Cart item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Failed to get cart item details
 */
router.get('/:id', verifyToken, CartController.getCartItemDetail);

module.exports = router;
