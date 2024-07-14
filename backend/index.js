require('dotenv').config();  // Load environment variables from .env file
console.log('SECRET_KEY:', process.env.SECRET_KEY);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const User = require('./models/User'); // Ensure the correct path
const auth = require('./middleware/auth'); // Ensure the correct path

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.SECRET_KEY;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.get('/user', auth, async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    res.json(user);
});

app.put('/user', auth, async (req, res) => {
    const { currency, volumePerClick, volumePerSecond, revenuePerTrade, prestigeMultiplier, lastLoggedIn, upgradeCosts } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    user.currency = currency;
    user.volumePerClick = volumePerClick;
    user.volumePerSecond = volumePerSecond;
    user.revenuePerTrade = revenuePerTrade;
    user.prestigeMultiplier = prestigeMultiplier;
    user.lastLoggedIn = lastLoggedIn;
    user.upgradeCosts = upgradeCosts;

    await user.save();

    res.json(user);
});

app.post('/reset', auth, async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    user.currency = 0;
    user.volumePerClick = 1;
    user.volumePerSecond = 0;
    user.revenuePerTrade = 1;
    user.prestigeMultiplier = 1;
    user.lastLoggedIn = new Date();
    user.upgradeCosts = [100, 500, 5000, 25000];

    await user.save();

    res.json({ user });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
