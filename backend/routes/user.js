// user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, user: { id: newUser._id, username: newUser.username } });
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, username: user.username } });
});

// Get user data
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user data
router.put('/user', auth, async (req, res) => {
    const { currency, volumePerClick, volumePerSecond, revenuePerTrade, prestigeMultiplier, lastLoggedIn, upgradeCosts } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.currency = Math.floor(currency); // Ensure currency is always a whole integer
            user.volumePerClick = volumePerClick;
            user.volumePerSecond = volumePerSecond;
            user.revenuePerTrade = revenuePerTrade;
            user.prestigeMultiplier = prestigeMultiplier;
            user.lastLoggedIn = lastLoggedIn;
            user.upgradeCosts = upgradeCosts;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset user data
router.post('/reset', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.currency = 0;
            user.volumePerClick = 1;
            user.volumePerSecond = 0;
            user.revenuePerTrade = 1;
            user.prestigeMultiplier = 1;
            user.lastLoggedIn = new Date();
            user.upgradeCosts = [100, 500, 5000, 25000];
            await user.save();
            res.json({ user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Purchase upgrade
router.post('/buy-upgrade', auth, async (req, res) => {
    const { upgradeIndex } = req.body;
    const user = await User.findById(req.user.id);
    if (user && user.currency >= user.upgradeCosts[upgradeIndex]) {
        user.currency -= user.upgradeCosts[upgradeIndex];
        switch (upgradeIndex) {
            case 0:
                user.volumePerClick += 1;
                break;
            case 1:
                user.volumePerSecond += 1;
                break;
            case 2:
                user.volumePerSecond *= 2;
                break;
            case 3:
                user.revenuePerTrade *= 1.5;
                break;
            default:
                return res.status(400).json({ message: 'Invalid upgrade index' });
        }
        user.upgradeCosts[upgradeIndex] *= 1.15;
        user.upgradeCosts[upgradeIndex] = Math.floor(user.upgradeCosts[upgradeIndex]);
        await user.save();
        res.json(user);
    } else {
        res.status(400).json({ message: 'Not enough currency or invalid upgrade index' });
    }
});

// Process trade
router.post('/process-trade', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        // Process volume per second trades
        const trades = user.volumePerSecond * user.prestigeMultiplier;
        const revenue = trades * user.revenuePerTrade;
        user.currency += revenue;
        user.currency = Math.floor(user.currency);
        await user.save();
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Prestige
router.post('/prestige', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user && user.currency >= 1000000) {
        user.currency = 0;
        user.volumePerClick = 1;
        user.volumePerSecond = 0;
        user.revenuePerTrade = 1;
        user.prestigeMultiplier *= 2;
        await user.save();
        res.json(user);
    } else {
        res.status(400).json({ message: 'Not enough currency to prestige' });
    }
});

module.exports = router;
