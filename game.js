class Upgrade {
    constructor(name, effect, cost, applyUpgrade) {
        this.name = name;
        this.effect = effect;
        this.cost = cost;
        this.applyUpgrade = applyUpgrade;
    }

    purchase(game) {
        if (game.currency >= this.cost) {
            game.currency -= this.cost;
            this.applyUpgrade(game);
            return true;
        }
        return false;
    }
}

class StockExchangeGame {
    constructor() {
        this.currency = 0;
        this.volumePerClick = 1;
        this.volumePerSecond = 0;
        this.revenuePerTrade = 1;
        this.prestigeMultiplier = 1;
        this.prestigeThreshold = 1000000;
        this.upgrades = this.createUpgrades();
    }

    createUpgrades() {
        return [
            new Upgrade("Increase Click Volume", "Doubles volume per click", 100, game => game.volumePerClick *= 2),
            new Upgrade("Basic Automation", "Adds 10 volume per second", 500, game => game.volumePerSecond += 10),
            new Upgrade("HFT Algorithms", "Doubles volume per second", 5000, game => game.volumePerSecond *= 2),
            new Upgrade("Automated Trade Matching Engine", "Increases revenue per trade by 50%", 25000, game => game.revenuePerTrade *= 1.5)
        ];
    }

    processTrades(seconds) {
        const trades = this.volumePerSecond * seconds * this.prestigeMultiplier;
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
        if (this.currency >= this.prestigeThreshold) {
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

class GameController {
    constructor() {
        this.game = new StockExchangeGame();
        this.isRunning = true;

        this.currencyLabel = document.getElementById('currency');
        this.volumePerClickLabel = document.getElementById('volumePerClick');
        this.volumePerSecondLabel = document.getElementById('volumePerSecond');
        this.prestigeMultiplierLabel = document.getElementById('prestigeMultiplier');
        this.tradeButton = document.getElementById('tradeButton');
        this.upgradeContainer = document.getElementById('upgrades');
        this.prestigeButton = document.getElementById('prestigeButton');

        this.tradeButton.addEventListener('click', () => this.manualTrade());
        this.prestigeButton.addEventListener('click', () => this.prestige());

        this.renderUpgrades();
        this.startGameLoop();
    }

    startGameLoop() {
        this.processTrades();
        this.updateUI();
    }

    processTrades() {
        this.game.processTrades(0.1);  // Process trades for 0.1 second intervals
        if (this.isRunning) {
            setTimeout(() => this.processTrades(), 100);  // Schedule next trade processing
        }
    }

    updateUI() {
        this.currencyLabel.innerText = `Currency: ${this.game.currency.toFixed(0)}`;
        this.volumePerClickLabel.innerText = `Volume per Click: ${this.game.volumePerClick.toFixed(0)}`;
        this.volumePerSecondLabel.innerText = `Volume per Second: ${this.game.volumePerSecond.toFixed(0)}`;
        this.prestigeMultiplierLabel.innerText = `Prestige Multiplier: ${this.game.prestigeMultiplier.toFixed(0)}`;

        if (this.isRunning) {
            setTimeout(() => this.updateUI(), 100);  // Schedule next UI update
        }
    }

    manualTrade() {
        this.game.manualTrade();
        this.updateUI();
    }

    buyUpgrade(index) {
        const success = this.game.buyUpgrade(index);
        if (success) {
            alert('Upgrade purchased!');
        } else {
            alert('Not enough funds to purchase upgrade.');
        }
        this.updateUI();
    }

    prestige() {
        const success = this.game.prestige();
        if (success) {
            alert('You have prestiged! Your progress is reset but you gain a permanent multiplier.');
        } else {
            alert('You need more currency to prestige.');
        }
        this.updateUI();
    }

    renderUpgrades() {
        this.upgradeContainer.innerHTML = '';
        this.game.upgrades.forEach((upgrade, index) => {
            const button = document.createElement('button');
            button.className = 'button';
            button.innerText = `${upgrade.name} (${upgrade.cost})`;
            button.addEventListener('click', () => this.buyUpgrade(index));
            this.upgradeContainer.appendChild(button);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});
