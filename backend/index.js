require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user'); // Import user routes

const app = express();
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

app.use('/api', userRoutes); // Use user routes with '/api' prefix

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
