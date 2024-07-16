// User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    currency: {
        type: Number,
        default: 5000,
    },
    volumePerClick: {
        type: Number,
        default: 1,
    },
    volumePerSecond: {
        type: Number,
        default: 0,
    },
    revenuePerTrade: {
        type: Number,
        default: 1,
    },
    prestigeMultiplier: {
        type: Number,
        default: 1,
    },
    upgradeCosts: {
        type: [Number],
        default: [100, 500, 5000, 25000],
    },
    lastLoggedIn: {
        type: Date,
        default: Date.now,
    },
    lastUpdate: { 
        type: Date,
        default: Date.now,
    }
});

UserSchema.methods.calculatePassiveIncome = function () {
    const now = new Date();
    const secondsElapsed = (now - this.lastUpdate) / 1000;
    const incomePerSecond = this.volumePerSecond * this.revenuePerTrade * this.prestigeMultiplier;
    const incrementalIncome = (incomePerSecond / 10) * secondsElapsed * 10;
    this.currency += incrementalIncome;
    this.lastUpdate = now;
};

module.exports = mongoose.model('User', UserSchema);
