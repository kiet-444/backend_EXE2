const express = require('express');
const router = express.Router();
const FundController = require('../controllers/Fund.controllers');
const { verifyToken, isAdmin } = require('../middleWare/auth.middleware');

router.post('/fund', verifyToken, FundController.addFund);

router.get('/fund', verifyToken, FundController.getFunds);

module.exports = router;