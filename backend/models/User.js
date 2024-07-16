// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    currency: {
        type: Number,
        default: 5000,
        min: 0
    },
    volumePerClick: {
        type: Number,
        default: 1,
        min: 1
    },
    volumePerSecond: {
        type: Number,
        default: 0,
        min: 0
    },
    revenuePerTrade: {
        type: Number,
        default: 1,
        min: 1
    },
    prestigeMultiplier: {
        type: Number,
        default: 1,
        min: 1
    },
    upgradeCosts: {
        type: [Number],
        default: [100, 500, 5000, 25000],
        validate: [arrayLimit, '{PATH} exceeds the limit of 4']
    },
    lastLoggedIn: {
        type: Date,
        default: Date.now
    },
    lastUpdate: { 
        type: Date,
        default: Date.now
    }
});

function arrayLimit(val) {
    return val.length <= 4;
}

UserSchema.methods.calculatePassiveIncome = function() {
    const now = new Date();
    const secondsElapsed = (now - this.lastUpdate) / 1000;
    const incomePerSecond = this.volumePerSecond * this.revenuePerTrade * this.prestigeMultiplier;
    const incrementalIncome = Math.floor((incomePerSecond / 10) * secondsElapsed * 10);
    this.currency += incrementalIncome;
    this.lastUpdate = now;
};

UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', UserSchema);