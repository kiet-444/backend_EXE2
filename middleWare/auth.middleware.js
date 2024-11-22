const jwt = require('jsonwebtoken');

// Middleware để xác thực token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
        
        // Lưu thông tin user id và role từ token vào req
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// Middleware để kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
};

// Middleware cho Sales Admin
const isSalesAdmin = (req, res, next) => {
    if (req.userRole !== 'sales-admin') return res.status(403).json({ message: 'Access denied' });
    next();
};

// Middleware cho Adopted Admin
const isAdoptedAdmin = (req, res, next) => {
    if (req.userRole !== 'adopted-admin') return res.status(403).json({ message: 'Access denied' });
    next();
};

// Middleware cho Sponsor
const isSponsor = (req, res, next) => {
    if (req.userRole !== 'sponsor') return res.status(403).json({ message: 'Access denied' });
    next();
};

// Middleware cho Admin và User cụ thể
const isUserOrAdmin = (req, res, next) => {
    if (req.userRole !== 'admin' && req.userId !== req.params.id) return res.status(403).json({ message: 'Access denied' });
    next();
};

module.exports = { verifyToken, isAdmin, isSalesAdmin, isAdoptedAdmin, isSponsor, isUserOrAdmin };
