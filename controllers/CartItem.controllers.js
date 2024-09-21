const CartItem = require('../models/CartItem');
const Product = require('../models/ProductItem');

const addCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const newCartItem = new CartItem({
            userId,
            productId,
            quantity,
            category: product.category
        });
        const savedCartItem = await newCartItem.save();
        res.status(201).json({ message: 'Item added to cart successfully', data: savedCartItem });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add item to cart', error });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { id, quantity } = req.body;

        const updatedCartItem = await CartItem.findByIdAndUpdate(id, { quantity }, { new: true });
        if (!updatedCartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.status(200).json({ message: 'Cart item updated successfully', data: updatedCartItem });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update cart item', error });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.body;

        const deletedCartItem = await CartItem.findByIdAndDelete(id);
        if (!deletedCartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.status(200).json({ message: 'Cart item removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove cart item', error });
    }
};

const getAllCartItems = async (req, res) => {
    try {
        const { userId, category } = req.query;
        const query = { userId };

        if (category) {
            query.category = category;
        }

        const cartItems = await CartItem.find(query).populate('productId');

        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'No cart items found' });
        }

        res.status(200).json({ data: cartItems });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get cart items', error });
    }
};

const getCartItemDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const cartItem = await CartItem.findById({_id: id}).populate('productId');
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.status(200).json({ data: cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get cart item details', error });
    }
};

module.exports = {
    addCartItem,
    updateCartItem,
    deleteCartItem,
    getAllCartItems,
    getCartItemDetail
};
