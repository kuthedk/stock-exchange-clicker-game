const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key';

mongoose.connect('mongodb://localhost:27017/stock-exchange-clicker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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
    const { currency, volumePerClick, volumePerSecond, revenuePerTrade, prestigeMultiplier, lastLoggedIn } = req.body;

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

    await user.save();

    res.json(user);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
