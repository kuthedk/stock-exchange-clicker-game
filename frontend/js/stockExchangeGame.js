// stockExchangeGame.js
import { Upgrade } from './upgrade.js';

export class StockExchangeGame {
    constructor(user) {
        this.currency = user.currency;
        this.volumePerClick = user.volumePerClick;
        this.volumePerSecond = user.volumePerSecond;
        this.revenuePerTrade = user.revenuePerTrade;
        this.prestigeMultiplier = user.prestigeMultiplier;
        this.upgrades = this.createUpgrades(user.upgradeCosts);
    }

    createUpgrades(upgradeCosts) {
        return [
            new Upgrade("Increase Click Volume", "Increases volume per click by 1", upgradeCosts[0], game => game.volumePerClick += 1),
            new Upgrade("Basic Automation", "Adds 1 volume per second", upgradeCosts[1], game => game.volumePerSecond += 1),
            new Upgrade("HFT Algorithms", "Doubles volume per second", upgradeCosts[2], game => game.volumePerSecond *= 2),
            new Upgrade("Automated Trade Matching Engine", "Increases revenue per trade by 50%", upgradeCosts[3], game => game.revenuePerTrade = game.revenuePerTrade * 1.5))
        ];
    }

    processTrades() {
        const trades = this.volumePerSecond * this.prestigeMultiplier;
        const revenue = trades * this.revenuePerTrade;
        this.currency += revenue;
    }

    manualTrade() {
        const trades = this.volumePerClick * this.prestigeMultiplier;
        const revenue = trades * this.revenuePerTrade;
        this.currency += revenue;
    }

    buyUpgrade(index) {
        const upgrade = this.upgrades[index];
        return upgrade.purchase(this);
    }

    prestige() {
        if (this.currency >= 1000000) {
            this.currency = 0;
            this.volumePerClick = 1;
            this.volumePerSecond = 0;
            this.revenuePerTrade = 1;
            this.prestigeMultiplier *= 2;
            return true;
        }
        return false;
    }
}
