const mongoose = require('mongoose');

const cartPetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    addedAt: { type: Date, default: Date.now }
});

const CartPet = mongoose.model('CartPet', cartPetSchema);   

module.exports = CartPet;