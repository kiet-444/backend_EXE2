const CartPet = require('../models/CartPet');
const Pet = require('../models/Pet');

// Add a new pet to the cart
const addPetToCart = async (req, res) => {
    try {
        const { petId, quantity } = req.body;
        const pet = await Pet.findById({ _id: petId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        if (quantity > pet.quantity) {
            return res.status(400).json({ message: 'Quantity exceeds available quantity' }); 
        }

        // Check if the pet is already in the cart
        let cartPet = await CartPet.findOne({ userId: req.userId, petId });
        if (cartPet) {
            cartPet.quantity += quantity;
        } else {
            cartPet = new CartPet({
                userId: req.userId,
                petId,
                quantity,
            });
        }
        const savedCartPet = await cartPet.save();
        res.status(201).json({ message: 'Pet added to cart successfully', data: savedCartPet });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add pet', error });
    }
};

const getCartPets = async (req, res) => {
    try {
        const cartPets = await CartPet.find({ userId: req.userId }).sort({ addedAt: -1 });
        res.status(200).json({ message: 'Cart pets retrieved successfully', data: cartPets });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get pets', error });
    }
};

const getCartPetDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const cartPet = await CartPet.findById({ _id: id });
        if (!cartPet) {
            return res.status(404).json({ message: 'Cart pet not found' });
        }   
        res.status(200).json({ message: 'Cart pet retrieved successfully', data: cartPet });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get cart pet details', error });
    }
};

const deleteCartPet = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedCartPet = await CartPet.findByIdAndDelete({ _id: id });
        if (!deletedCartPet) {
            return res.status(404).json({ message: 'Cart pet not found' });
        }
        res.status(200).json({ message: 'Cart pet removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove cart pet', error });
    }
};

const updateStatusCartPet = async (req, res) => {
    try {
        const { id, status } = req.body;
        const updatedCartPet = await CartPet.findByIdAndUpdate({ _id: id }, { status }, { new: true });
        if (!updatedCartPet) {
            return res.status(404).json({ message: 'Cart pet not found' });
        }
        res.status(200).json({ message: 'Cart pet status updated successfully', data: updatedCartPet });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update cart pet status', error });
    }
};

module.exports = { addPetToCart, getCartPets, getCartPetDetail, deleteCartPet, updateStatusCartPet };