const express = require('express');
const router = express.Router();
const AdoptionRequestController = require('../controllers/AdoptionRequest.controllers');
const { verifyToken, isAdmin } = require('../middleWare/auth.middleware');


// Create new adoption request
router.post('/adoption-request', verifyToken, AdoptionRequestController.createAdoptionRequest);

module.exports = router;