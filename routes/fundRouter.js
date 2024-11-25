const express = require('express');
const router = express.Router();
const FundController = require('../controllers/Fund.controllers');
const { verifyToken, isAdmin } = require('../middleWare/auth.middleware');



/**
 * @swagger
 * /api/fund:
 *   post:
 *     summary: Create a new fund
 *     tags: [Fund]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of the fund
 *     responses:
 *       200:
 *         description: Successfully created a new fund
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fund'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */



/**
 * @swagger
 * /api/fund:
 *   post:
 *     summary: Create a new fund
 *     tags: [Fund]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of the fund
 *     responses:
 *       200:
 *         description: Successfully created a new fund
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fund'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post('/fund', verifyToken, FundController.addFund);

/**
 * @swagger
 * /api/fund:
 *   get:
 *     summary: Get all funds
 *     tags: [Fund]
 *     responses:
 *       200:
 *         description: Successfully retrieved all funds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     funds:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Fund'
 *                     totalAmount:
 *                       type: number
 *                       description: The total amount of funds
 *                 message:
 *                   type: string
 *                   description: The message of the response
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get('/fund', verifyToken, FundController.getFunds);

module.exports = router;