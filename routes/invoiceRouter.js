const express = require('express');
const router = express.Router();
const InvoiceController = require('../controllers/Invoice.controller');
const { verifyToken, isAdmin } = require('../middleWare/auth.middleware');


// Create new invoice
router.post('/invoice', verifyToken, InvoiceController.addInvoice);

// Get invoices 
router.get('/invoice', verifyToken, InvoiceController.getInvoices);

module.exports = router;