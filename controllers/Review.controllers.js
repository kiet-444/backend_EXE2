const Review = require('../models/Review');
const Product = require('../models/ProductItem');


const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        const product = await Product.findById({_id: productId});

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const newReview = new Review({
            user: req.userId,
            product: productId,
            rating,
            comment
        });
        const savedReview = await newReview.save();

        product.reviews.push(savedReview);
        product.averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({ message: 'Review created successfully', data: savedReview });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create review', error });
    }
};


const getReviewByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId }).populate('user', 'name').populate('product', 'name');
        res.status(200).json({ data: reviews , message: 'Reviews retrieved successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Failed to get reviews', error });
    }
};

module.exports = {
    createReview,
    getReviewByProduct
};

