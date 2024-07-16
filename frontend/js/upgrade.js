// upgrade.js
export class Upgrade {
    constructor(name, description, cost, applyUpgrade, costMultiplier = 1.15) {
        this.name = name;
        this.description = description;
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
        this.cost = Math.ceil(this.cost * this.costMultiplier);
    }
}