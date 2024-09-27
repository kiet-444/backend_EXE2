const CartItem = require('../models/CartItem');
const Product = require('../models/ProductItem');

const addCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        if(product.quantity < quantity) {
            return res.status(400).json({ message: 'Quantity exceeds available quantity' });
        }

        

        let newCartItem =  await CartItem.findOne({ userId: req.userId, productId });
        if (newCartItem) {
            newCartItem.quantity += quantity;
        } else {
            newCartItem = new CartItem({
                userId: req.userId,
                productId,
                quantity,
                category: product.category
            });
        }
        const savedCartItem = await newCartItem.save();
        res.status(201).json({ message: 'Item added to cart successfully', data: savedCartItem });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add item to cart', error });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { id, quantity } = req.body;

        const updatedCartItem = await CartItem.findByIdAndUpdate({ _id: id }, { quantity }, { new: true });
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
        const { id } = req.params;

        const deletedCartItem = await CartItem.findByIdAndDelete({ _id: id });
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
        const { category } = req.query;
        const query = { userId: req.userId };

        if (category) {
            query.category = category;
        }

        const cartItems = await CartItem.find(query).populate('productId').sort({ createdAt: -1 });

        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'No cart items found' });
        }

        let totalCartValue = 0;

        const cartItemsWithSubtotal = cartItems.map(item => {
            const subtotal = item.quantity * item.productId.price;
            totalCartValue += subtotal; 
            return {
                ...item._doc,  
                subtotal     
            };
        });

        res.status(200).json({
            data: {...cartItemsWithSubtotal._doc,
            totalCartValue }
            , message: 'Cart items retrieved successfully'
        });
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

        const subtotal = cartItem.quantity * cartItem.productId.price;
        res.status(200).json({ data: {
            ...cartItem._doc,
            subtotal
        }, message: 'Cart item retrieved successfully' });
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
