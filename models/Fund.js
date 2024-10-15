const mongoose = require('mongoose');

const FundSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateReceived: { type: Date},
    amount: { type: Number },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    orderCode: { type: String, required: true },
});

const Fund = mongoose.model('Fund', FundSchema);
module.exports = Fund;