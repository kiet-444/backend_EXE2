const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Product  = require('../models/ProductItem');

const PayOS = require('@payos/node');
const dotenv = require('dotenv');
dotenv.config();
const payos = new PayOS(process.env.PAYOS_API_KEY, 
    process.env.PAYOS_API_SECRET, 
    process.env.PAYOS_ENVIRONMENT
);

const addInvoice = async (req, res) => {
    try {
        const { productIds, quantities, amount} = req.body;
        const orderCode = Math.floor(Math.random() * 1000000000);

        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length === 0) {
            return res.status(400).json({ message: 'No products found for the provided IDs' });
        }
        const items = products.map((product, index) => {
            const quantity = quantities[index];
            return {
                productId: product._id,
                quantity,
                price: product.price,
                subTotal: product.price * quantity
            };
        });

        const order = {
            amount,
            orderCode,
            description: `Payment for order ${orderCode}`,
            returnUrl: "",
            cancelUrl: "",
        };

        const newInvoice = new Invoice({
            user: req.userId,
            orderCode,
            totalAmount: amount,
            items
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