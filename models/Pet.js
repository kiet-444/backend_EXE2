const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sex: { type: String, required: true },
    breed: { type: String, required: true },
    vaccinated: { type: Boolean, required: true },
    healthStatus: { type: String, required: true },
    image_id: { type: String, required: true }
}, { timestamps: true });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
