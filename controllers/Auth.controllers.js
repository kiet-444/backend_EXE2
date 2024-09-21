const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password, address } = req.body;
        const user = new User({ username, email, password, address });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', error_code: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error });
    }
};

// Login a user and return a JWT token
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Failed to login', error });
    }
};

module.exports = { register, login };
