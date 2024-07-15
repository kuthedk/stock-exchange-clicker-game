// upgrade.js
export class Upgrade {
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
            game.currency = roundNumber(game.currency);
            this.applyUpgrade(game);
            this.increaseCost();
            return true;
        }
        return false;
    }

    increaseCost() {
        this.cost *= this.costMultiplier;
        this.cost = roundNumber(this.cost);
    }
}

const roundNumber = value => Math.floor(value);
