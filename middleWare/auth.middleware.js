// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
};

const isUserOrAdmin = (req, res, next) => {
    if (req.userRole !== 'admin' && req.userId !== req.params.id) return res.status(403).json({ message: 'Access denied' });
    next();
};

module.exports = { verifyToken, isAdmin, isUserOrAdmin };
