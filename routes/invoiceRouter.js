const express = require('express');
const router = express.Router();
const InvoiceController = require('../controllers/Invoice.controller');
const { verifyToken, isAdmin } = require('../middleWare/auth.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the invoice
 *         userId:
 *           type: string
 *           description: The user ID of the invoice
 *         firstName:
 *           type: string
 *           description: The first name of the invoice
 *         lastName:
 *           type: string
 *           description: The last name of the invoice
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the invoice
 *         street:
 *           type: string
 *           description: The street of the invoice
 *         ward:
 *           type: string
 *           description: The ward of the invoice
 *         district:
 *           type: string
 *           description: The district of the invoice
 *         city:
 *           type: string
 *           description: The city of the invoice
 *         amount:
 *           type: number
 *           description: The amount of the invoice
 *         shippingFee:
 *           type: number
 *           description: The shipping fee of the invoice
 *         totalAmount:
 *           type: number
 *           description: The total amount of the invoice
 *         orderCode:
 *           type: string
 *           description: The order code of the invoice
 *         status:
 *           type: string
 *           description: The status of the invoice
 */

/**
 * @swagger
 * /api/invoice:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the invoice
 *               lastName:
 *                 type: string
 *                 description: The last name of the invoice
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the invoice
 *               street:
 *                 type: string
 *                 description: The street of the invoice
 *               ward:
 *                 type: string
 *                 description: The ward of the invoice
 *               district:
 *                 type: string
 *                 description: The district of the invoice
 *               city:
 *                 type: string
 *                 description: The city of the invoice
 *               amount:
 *                 type: number
 *                 description: The amount of the invoice
 *               shippingFee:
 *                 type: number
 *                 description: The shipping fee of the invoice
 *               totalAmount:
 *                 type: number
 *                 description: The total amount of the invoice
 *               cartItemId:
 *                 type: string
 *                 description: The cart item ID associated with the invoice
 *     responses:
 *       200:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       500:
 *         description: Failed to create invoice
 */

// Create new invoice
router.post('/invoice', verifyToken, InvoiceController.addInvoice);

/**
 * @swagger
 * /api/invoice:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoice]
 *     responses:
 *       200:
 *         description: Successfully retrieved all invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       500:
 *         description: Internal server error   
 */

// Get invoices
router.get('/invoice', verifyToken, InvoiceController.getInvoices);

/**
 * @swagger
 * /api/invoices/orderCode/{orderCode}:
 *   get:
 *     summary: Get an invoice by orderCode
 *     tags: [Invoice]
 *     parameters:
 *       - in: path
 *         name: orderCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The orderCode of the invoice
 *     responses:
 *       200:
 *         description: Successfully retrieved the invoice
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */
router.get('/invoices/orderCode/:orderCode', verifyToken,InvoiceController.getInvoiceByOrderCode);


// router.post('/test-payos', InvoiceController.testPayOS);

module.exports = router;
