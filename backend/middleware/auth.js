// auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    console.log('Received token:', token);

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Decoded token:', decoded);
        req.user = decoded;

        const user = await User.findById(req.user.id);
        if (user) {
            console.log('User found:', user);
            user.calculatePassiveIncome();
            await user.save();
        } else {
            console.log('User not found for ID:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(400).json({ message: 'Token is not valid' });
    }
};
