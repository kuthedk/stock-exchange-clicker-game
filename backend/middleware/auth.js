const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';
const User = require('../models/User');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;

        const user = await User.findById(req.user.id);
        if (user) {
            user.calculatePassiveIncome();
            await user.save();
        }

        next();
    } catch (err) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};
