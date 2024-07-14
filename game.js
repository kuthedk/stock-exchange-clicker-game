let token = null;
let user = null;

document.getElementById('registerButton').addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        token = data.token;
        user = data.user;
        showGame();
    } else {
        showNotification(data.message);
    }
});

document.getElementById('loginButton').addEventListener('click', async () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        token = data.token;
        user = data.user;
        showGame();
        loadUserData();
    } else {
        showNotification(data.message);
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    token = null;
    user = null;
    document.getElementById('game').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
});

const showGame = () => {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
};

const loadUserData = async () => {
    const response = await fetch('/user', {
        method: 'GET',
        headers: { 'x-auth-token': token },
    });

    const data = await response.json();
    if (response.ok) {
        user = data;
        updateUI();
    } else {
        showNotification(data.message);
    }
};

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
    constructor(user) {
        this.currency = user.currency;
        this.volumePerClick = user.volumePerClick;
        this.volumePerSecond = user.volumePerSecond;
        this.revenuePerTrade = user.revenuePerTrade;
        this.prestigeMultiplier = user.prestigeMultiplier;
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

let game = null;

const updateUI = () => {
    document.getElementById('currency').innerText = `Currency: ${formatNumber(game.currency)}`;
    document.getElementById('volumePerClick').innerText = `Volume per Click: ${formatNumber(game.volumePerClick)}`;
    document.getElementById('volumePerSecond').innerText = `Volume per Second: ${formatNumber(game.volumePerSecond)}`;
    document.getElementById('prestigeMultiplier').innerText = `Prestige Multiplier: ${formatNumber(game.prestigeMultiplier)}`;

    document.getElementById('upgrades').innerHTML = '';
    game.upgrades.forEach((upgrade, index) => {
        const button = document.createElement('button');
        button.className = 'button';
        button.innerText = `${upgrade.name} (${formatNumber(upgrade.cost)})`;
        button.addEventListener('click', () => buyUpgrade(index));
        document.getElementById('upgrades').appendChild(button);
    });
};

const saveUserData = async () => {
    await fetch('/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({
            currency: game.currency,
            volumePerClick: game.volumePerClick,
            volumePerSecond: game.volumePerSecond,
            revenuePerTrade: game.revenuePerTrade,
            prestigeMultiplier: game.prestigeMultiplier,
            lastLoggedIn: new Date()
        })
    });
};

const formatNumber = value => {
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
};

const showNotification = message => {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
};

document.getElementById('tradeButton').addEventListener('click', () => {
    game.manualTrade();
    updateUI();
    saveUserData();
});

document.getElementById('prestigeButton').addEventListener('click', () => {
    if (game.prestige()) {
        showNotification('You have prestiged! Your progress is reset but you gain a permanent multiplier.');
    } else {
        showNotification('You need more currency to prestige.');
    }
    updateUI();
    saveUserData();
});

const buyUpgrade = index => {
    if (game.buyUpgrade(index)) {
        showNotification('Upgrade purchased!');
    } else {
        showNotification('Not enough funds to purchase upgrade.');
    }
    updateUI();
    saveUserData();
};

const startGameLoop = () => {
    const processTrades = () => {
        game.processTrades(0.1);  // Process trades for 0.1 second intervals
        setTimeout(processTrades, 100);  // Schedule next trade processing
    };

    const updateUIInterval = () => {
        updateUI();
        setTimeout(updateUIInterval, 100);  // Schedule next UI update
    };

    processTrades();
    updateUIInterval();
};

document.addEventListener('DOMContentLoaded', async () => {
    if (token) {
        showGame();
        await loadUserData();
        startGameLoop();
    }
});
