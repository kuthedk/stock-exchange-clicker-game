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
        default: 0,
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
});

UserSchema.methods.calculatePassiveIncome = function () {
    const now = new Date();
    const secondsElapsed = (now - this.lastLoggedIn) / 1000;
    const passiveIncome = this.volumePerSecond * secondsElapsed * this.revenuePerTrade * this.prestigeMultiplier;
    this.currency += passiveIncome;
    this.lastLoggedIn = now;
};

module.exports = mongoose.model('User', UserSchema);
