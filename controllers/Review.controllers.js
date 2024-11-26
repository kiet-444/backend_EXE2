const Review = require('../models/Review');
const Product = require('../models/ProductItem');
const User = require('../models/User');


const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        // Find the product by its ID
        const product = await Product.findById({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create a new review
        const newReview = new Review({
            user: req.userId,
            product: productId,
            rating,
            comment
        });

        // Save the review
        const savedReview = await newReview.save();

        // Push the review to the product's reviews array
        product.reviews.push(savedReview);

        const reviews = await Promise.all(
            product.reviews.map(reviewId => Review.findById(reviewId))
        );

        const sumRatings = reviews.reduce((sum, review) => {
            if (review && typeof review.rating === 'number') {
                return sum + review.rating;
            }
            return sum;
        }, 0);

        const averageRating = sumRatings / reviews.length;
        product.averageRating = isNaN(averageRating) ? 0 : averageRating;

        await product.save();

        res.status(201).json({ message: 'Review created successfully', data: savedReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create review', error });
    }
};




const getReviewByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId });

        const updateReviews = await Promise.all(reviews.map(async (review) => {
            const user = await User.findById(review.user);
            return {...review._doc, userName: user.username};
        }))
        res.status(200).json({ data: updateReviews , message: 'Reviews retrieved successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Failed to get reviews', error });
    }
};

module.exports = {
    createReview,
    getReviewByProduct
};

