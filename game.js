class Upgrade {
    constructor(name, effect, cost, applyUpgrade, costMultiplier = 1.15) {
        this.name = name;
        this.effect = effect;
        this.cost = cost;
        this.applyUpgrade = applyUpgrade;
        this.costMultiplier = costMultiplier;
    }

    purchase(game) {
        if (game.currency >= this.cost) {
            game.currency -= this.cost;
            this.applyUpgrade(game);
            this.increaseCost();
            return true;
        }
        return false;
    }

    increaseCost() {
        this.cost *= this.costMultiplier;
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
            new Upgrade("Increase Click Volume", "Increases volume per click", 100, game => game.volumePerClick += 1),
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
        this.notificationElement = document.getElementById('notification');

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
        this.currencyLabel.innerText = `Currency: ${this.formatNumber(this.game.currency)}`;
        this.volumePerClickLabel.innerText = `Volume per Click: ${this.formatNumber(this.game.volumePerClick)}`;
        this.volumePerSecondLabel.innerText = `Volume per Second: ${this.formatNumber(this.game.volumePerSecond)}`;
        this.prestigeMultiplierLabel.innerText = `Prestige Multiplier: ${this.formatNumber(this.game.prestigeMultiplier)}`;

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
            this.showNotification('Upgrade purchased!');
        } else {
            this.showNotification('Not enough funds to purchase upgrade.');
        }
        this.renderUpgrades();  // Update the upgrade buttons with new costs
        this.updateUI();
    }

    prestige() {
        const success = this.game.prestige();
        if (success) {
            this.showNotification('You have prestiged! Your progress is reset but you gain a permanent multiplier.');
        } else {
            this.showNotification('You need more currency to prestige.');
        }
        this.updateUI();
    }

    renderUpgrades() {
        this.upgradeContainer.innerHTML = '';
        this.game.upgrades.forEach((upgrade, index) => {
            const button = document.createElement('button');
            button.className = 'button';
            button.innerText = `${upgrade.name} (${this.formatNumber(upgrade.cost)})`;
            button.addEventListener('click', () => this.buyUpgrade(index));
            this.upgradeContainer.appendChild(button);
        });
    }

    showNotification(message) {
        this.notificationElement.innerText = message;
        this.notificationElement.style.display = 'block';
        setTimeout(() => {
            this.notificationElement.style.display = 'none';
        }, 3000);
    }

    formatNumber(value) {
        if (value < 1000) return value.toFixed(0);

        const units = [
            "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", 
            "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion", 
            "tredecillion", "quattuordecillion", "quindecillion", "sexdecillion", "septendecillion", 
            "octodecillion", "novemdecillion", "vigintillion", "unvigintillion", "duovigintillion"
        ];
        let unitIndex = -1;
        let reducedValue = value;

        while (reducedValue >= 1000) {
            reducedValue /= 1000;
            unitIndex++;
        }

        return reducedValue.toFixed(3) + ' ' + units[unitIndex];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});
