const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/Review.controllers');
const { verifyToken, isAdmin } = require('../middleWare/auth.middleware');



/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: The rating of the review
 *               comment:
 *                 type: string
 *                 description: The comment of the review
 *               productId:
 *                 type: string
 *                 description: The ID of the product
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to create review
 */

// Create new review
/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: The rating of the review
 *               comment:
 *                 type: string
 *                 description: The comment of the review
 *               productId:
 *                 type: string
 *                 description: The ID of the product
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to create review
 */
router.post('/review', verifyToken, ReviewController.createReview);

// Get reviews by product
/**
 * @swagger
 * /api/review/{productId}:
 *   get:
 *     summary: Get reviews by product
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to get reviews
 */
router.get('/review/:productId', ReviewController.getReviewByProduct);

module.exports = router;