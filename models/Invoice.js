const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  street: {
    type: String,
  },
  ward: {
    type: String,
  },
  district: {
    type: String,
  },
  city: {
    type: String,
  },
  amount: {
    type: Number,
  },
  shippingFee: {
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
  cartItem: { type : mongoose.Schema.Types.ObjectId, ref: 'CartItem' },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Cancelled'],
    default: 'Pending',
  },
  orderCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
