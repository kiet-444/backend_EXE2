const Invoice = require('../models/Invoice');
const User = require('../models/User');
const CartItem = require('../models/CartItem');

const PayOS = require('@payos/node');
const dotenv = require('dotenv');
dotenv.config();
const payos = new PayOS(process.env.PAYOS_API_KEY, 
    process.env.PAYOS_API_SECRET, 
    process.env.PAYOS_ENVIRONMENT
);

const addInvoice = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, street, ward, district, city, amount, shippingFee, totalAmount, cartItemId} = req.body;
        const orderCode = Math.floor(Math.random() * 1000000000);

        const  cartItem = await CartItem.findById(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const order = {
            totalAmount,
            orderCode,
            description: `Payment for order ${orderCode}`,
            returnUrl: "https://hopeful-tail-trust-fe.vercel.app/payment-successful",
            cancelUrl: "https://hopeful-tail-trust-fe.vercel.app/hopeful-tail-trust-fe.vercel.app",
        };

        const newInvoice = new Invoice({
            user: req.userId,
            orderCode,
            totalAmount: totalAmount,
            shippingFee,
            firstName,
            lastName,
            phoneNumber,
            street,
            ward,
            district,
            city,
            amount,
            cartItem: cartItemId
        });
        await newInvoice.save();

        const paymentLink = await payos.createPaymentLink(order);
        res.json({ checkoutUrl: paymentLink.checkoutUrl });

    } catch (error) {
        res.status(500).json({ message: 'Failed to add invoice', error });

    }
}

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('user', 'name');
        res.status(200).json({ data: invoices });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get invoices', error });
    }
}

module.exports = {
    addInvoice,
    getInvoices
}