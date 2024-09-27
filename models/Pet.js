const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true }, // Loài của thú nuôi
    coatColor: { type: String, required: true }, // Màu lông
    sex: { 
        type: String, 
        required: true, 
        enum: ['Male', 'Female'],  // Giới hạn các giá trị
    },
    breed: { type: String, required: true },
    vaccinated: { type: Boolean, required: true },
    healthStatus: { 
        type: String, 
        required: true,
        enum: ['Healthy', 'Sick', 'Injured', 'Recovering'] // Tình trạng sức khỏe
    },
    image_id: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
}, { timestamps: true });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
