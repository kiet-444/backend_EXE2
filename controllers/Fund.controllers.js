const Fund = require('../models/Fund');
const PayOS = require('@payos/node');
const dotenv = require('dotenv');
dotenv.config();
const payos = new PayOS(
    process.env.PAYOS_API_SECRET, 
    process.env.PAYOS_API_KEY, 
    process.env.PAYOS_ENVIRONMENT
);

const addFund = async (req, res) => {  
    try {
        const { amount } = req.body;
        const orderCode = Math.floor(Math.random() * 10000000);
        const order = {
            amount,
            orderCode,
            description: `Payment for order ${orderCode}`,
            returnUrl: "https://hopeful-tail-trust-fe.vercel.app/donation-successful",
            cancelUrl: "https://hopeful-tail-trust-fe.vercel.app/",
        };

        const newFund = new Fund({
            user: req.userId,
            orderCode,
            amount,
            dataReceived: new Date(),
        });

        await newFund.save();

        const paymentLink = await payos.createPaymentLink(order);
        res.json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add fund', error });
    }
}

const getFunds = async (req, res) => {
    try {
        
        const isAdmin = req.isAdmin; // Middleware cần cung cấp `req.isAdmin`

        let funds;
        let totalAmount = 0;

        if (isAdmin) {
            // Admin có thể xem tất cả các quỹ
            funds = await Fund.find().populate('user', 'name');
            totalAmount = funds.reduce((acc, fund) => acc + (fund.amount || 0), 0);
        } else {
            // Người dùng thường chỉ xem các quỹ của họ
            funds = await Fund.find({ user: req.userId }).populate('user', 'name');
            totalAmount = funds.reduce((acc, fund) => acc + (fund.amount || 0), 0);
        }

        res.status(200).json({
            data: { funds, totalAmount },
            message: isAdmin
                ? 'All funds retrieved successfully'
                : 'Your funds retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get funds', error });
    }
};


module.exports = {
    addFund, getFunds 
}