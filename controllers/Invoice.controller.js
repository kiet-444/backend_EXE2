const Invoice = require('../models/Invoice');
const User = require('../models/User');
const CartItem = require('../models/CartItem');

const PayOS = require('@payos/node');

const dotenv = require('dotenv');
dotenv.config();


const payos = new PayOS(
    process.env.PAYOS_API_SECRET, 
    process.env.PAYOS_API_KEY, 
    process.env.PAYOS_ENVIRONMENT
);

const addInvoice = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, street, ward, district, city, amount, shippingFee, totalAmount, cartItemIds} = req.body;
        console.log(req.body);
        
        const orderCode = Math.floor(Math.random() * 1000000);// tao ma don hang

        const  cartItems = await CartItem.find({_id: { $in: cartItemIds }});
        if (!cartItems.length === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const order = {
            amount: totalAmount,
            orderCode,
            description: `Payment for order ${orderCode}`,
            returnUrl: "https://hopeful-tail-trust-fe.vercel.app/payment-successful",
            cancelUrl: "https://hopeful-tail-trust-fe.vercel.app/",
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
            cartItem: cartItemIds
        });
        const savedInvoice = await newInvoice.save();

        console.log("Order created:", order);


        // in ra loi khi khong tao duoc link

        const paymentLink = await payos.createPaymentLink(order);

        if (!paymentLink.checkoutUrl) {
            return res.status(500).json({ message: 'Failed to create payment link' });
        }

        console.log("Payment link created:", paymentLink);
        res.json({ checkoutUrl: paymentLink.checkoutUrl });

    } catch (error) {
        console.error("PayOS Error:", error); 
        res.status(500).json({ message: 'Failed to test PayOS', error: error.message || JSON.stringify(error) });

    }
}

// const testPayOS = async (req, res) => {
//     try {
//         console.log("Test PayOS");
//         const orderCode = Math.floor(Math.random() * 10000000);
//         const order = {
//             amount: 1000,
//             orderCode,
//             description: `Payment for order ${orderCode}`,
//             returnUrl: "http://localhost:3000/payment-successful",
//             cancelUrl: "http://localhost:3000",
//         };

//         console.log("Order created:", order);

//         const paymentLink = await payos.createPaymentLink(order);
//         console.log("Payment link created:", paymentLink);
//         res.json({ checkoutUrl: paymentLink.checkoutUrl });

//     } catch (error) {
//     console.error("PayOS Error:", error); // Log the error with full details
//     res.status(500).json({ message: 'Failed to test PayOS', error: error.message || JSON.stringify(error) });
//     }
// }

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('userId', 'name');
        if (!invoices) {
            return res.status(404).json({ message: 'No invoices found' });
        }
        res.status(200).json({ data: invoices });
    } catch (error) {
        console.error(error);  
        res.status(500).json({ message: 'Failed to get invoices', error: error.message });
    }
};

const getInvoiceByOrderCode = async (req, res) => {
    try {
        const { orderCode } = req.params;

        // Tìm invoice theo orderCode và populate các trường liên quan
        const invoice = await Invoice.findOne({ orderCode })
            .populate('userId', 'name email') // Populate thông tin user
            .populate('cartItem'); // Populate thông tin cartItem

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({
            data: invoice,
            message: 'Invoice retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get invoice by order code', error: error.message });
    }
};




module.exports = {
    addInvoice,
    getInvoices,
    getInvoiceByOrderCode
    // testPayOS
}