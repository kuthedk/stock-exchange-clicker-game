const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currency: { type: Number, default: 0 },
    volumePerClick: { type: Number, default: 1 },
    volumePerSecond: { type: Number, default: 0 },
    revenuePerTrade: { type: Number, default: 1 },
    prestigeMultiplier: { type: Number, default: 1 },
    lastLoggedIn: { type: Date, default: Date.now },
    upgradeCosts: { type: [Number], default: [100, 500, 5000, 25000] }  // Initial upgrade costs
});

UserSchema.methods.calculatePassiveIncome = function () {
    const now = Date.now();
    const timeElapsed = (now - new Date(this.lastLoggedIn).getTime()) / 1000; // in seconds
    const maxPassiveIncomeTime = 3600; // 1 hour
    const effectiveTime = Math.min(timeElapsed, maxPassiveIncomeTime);

    const passiveIncome = this.volumePerSecond * effectiveTime * this.revenuePerTrade * this.prestigeMultiplier;
    this.currency += passiveIncome;
    this.lastLoggedIn = now;
};

module.exports = mongoose.model('User', UserSchema);
