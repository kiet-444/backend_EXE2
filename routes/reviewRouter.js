const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/Review.controllers');
const { verifyToken, isAdmin } = require('../middleWare/auth.middleware');


// Create new review
router.post('/review', verifyToken, ReviewController.createReview);

// Get reviews by product
router.get('/review/:productId', ReviewController.getReviewByProduct);

module.exports = router;