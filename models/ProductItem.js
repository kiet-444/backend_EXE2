const mongoose = require('mongoose');

const productItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: 1,
    },
    image_id: {
        type: String,
        required: [true, 'Product image is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
    },
    oldPrice: {
        type: Number,
    },
    code: {
        type: String,
        required: [true, 'Product code is required'],
        trim: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    supportPercentage: {
        type: Number,
        default: 5, // Default value set to 5%
        min: 5,
        max: 10,
        required: [true, 'Support percentage is required'],
    },

    keywords: [{ type: String }],

    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
}, {
    timestamps: true,
});

productItemSchema.index({ name: 'text', description: 'text', keywords: 'text' });


const ProductItem = mongoose.model('ProductItem', productItemSchema);

module.exports = ProductItem;
