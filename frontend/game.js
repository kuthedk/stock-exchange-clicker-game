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
            game.currency = roundNumber(game.currency); // Ensure currency is a whole integer
            this.applyUpgrade(game);
            this.increaseCost();
            return true;
        }
        return false;
    }

    increaseCost() {
        this.cost *= this.costMultiplier;
        this.cost = roundNumber(this.cost); // Ensure cost is a whole integer
    }
}

class StockExchangeGame {
    constructor(user) {
        this.currency = roundNumber(user.currency); // Ensure currency is a whole integer
        this.volumePerClick = user.volumePerClick;
        this.volumePerSecond = user.volumePerSecond;
        this.revenuePerTrade = user.revenuePerTrade;
        this.prestigeMultiplier = user.prestigeMultiplier;
        this.upgrades = this.createUpgrades(user.upgradeCosts);
    }

    createUpgrades(upgradeCosts) {
        return [
            new Upgrade("Increase Click Volume", "Increases volume per click", upgradeCosts[0], game => game.volumePerClick += 1),
            new Upgrade("Basic Automation", "Adds 10 volume per second", upgradeCosts[1], game => game.volumePerSecond += 10),
            new Upgrade("HFT Algorithms", "Doubles volume per second", upgradeCosts[2], game => game.volumePerSecond *= 2),
            new Upgrade("Automated Trade Matching Engine", "Increases revenue per trade by 50%", upgradeCosts[3], game => game.revenuePerTrade *= 1.5)
        ];
    }

    processTrades(seconds) {
        const trades = this.volumePerSecond * seconds * this.prestigeMultiplier;
        const revenue = trades * this.revenuePerTrade;
        this.currency += revenue;
        this.currency = roundNumber(this.currency); // Ensure currency is a whole integer
    }

    manualTrade() {
        const trades = this.volumePerClick * this.prestigeMultiplier;
        const revenue = trades * this.revenuePerTrade;
        this.currency += revenue;
        this.currency = roundNumber(this.currency); // Ensure currency is a whole integer
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

let token = null;
let user = null;
let game = null;
let saveQueue = [];

const showGame = () => {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    console.log('Game shown.');
};

const loadUserData = async () => {
    console.log('Loading user data...');
    console.log('Using token:', token);
    const response = await fetch('http://localhost:5001/api/user', {
        method: 'GET',
        headers: { 'x-auth-token': token },
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
        user = data;
        game = new StockExchangeGame(user);
        console.log('User data loaded:', user);
        startGameLoop();
        updateUI();
    } else {
        console.error('Failed to load user data:', data.message);
        showNotification(data.message);
    }
};

const checkSaveStatus = async () => {
    console.log('Checking save status...');
    const response = await fetch('http://localhost:5001/api/save-status', {
        method: 'GET',
        headers: { 'x-auth-token': token },
    });

    const data = await response.json();
    console.log('Pending saves:', data.pendingSaves);
    return data.pendingSaves;
};

document.getElementById('registerButton').addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    console.log('Registering user...');
    const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        token = data.token;
        user = data.user;
        console.log('User registered:', user);
        showGame();
    } else {
        showNotification(data.message);
    }
});

document.getElementById('loginButton').addEventListener('click', async () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Logging in user...');
    const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        token = data.token;
        user = data.user;
        console.log('User logged in:', user);
        showGame();
        loadUserData();
    } else {
        showNotification(data.message);
    }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    console.log('Logging out user...');
    // Attempt to process the save queue immediately
    await processSaveQueue();

    token = null;
    user = null;
    game = null;
    document.getElementById('game').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
    console.log('User logged out.');
});

document.getElementById('resetButton').addEventListener('click', async () => {
    console.log('Resetting user account...');
    const response = await fetch('http://localhost:5001/api/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    });

    const data = await response.json();
    if (response.ok) {
        user = data.user;
        game = new StockExchangeGame(user);
        console.log('User account reset:', user);
        await updateUI();
        showNotification('Account has been reset.');
    } else {
        showNotification(data.message);
    }
});

const updateUI = async () => {
    if (game) {
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
        // console.log('UI updated.');
    } else {
        console.error('Game object is not initialized');
    }
};

const buyUpgrade = async index => {
    if (game && game.buyUpgrade(index)) {
        showNotification('Upgrade purchased!');
    } else {
        showNotification('Not enough funds to purchase upgrade.');
    }
    await updateUI();
    saveUserData();
};

const saveUserData = debounce(async () => {
    if (game) {
        const upgradeCosts = game.upgrades.map(upgrade => upgrade.cost);

        const userData = {
            currency: game.currency,
            volumePerClick: game.volumePerClick,
            volumePerSecond: game.volumePerSecond,
            revenuePerTrade: game.revenuePerTrade,
            prestigeMultiplier: game.prestigeMultiplier,
            lastLoggedIn: new Date(),
            upgradeCosts: upgradeCosts
        };

        try {
            console.log('Saving user data...', userData);
            await fetch('http://localhost:5001/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(userData)
            });
            console.log('User data saved.');
        } catch (error) {
            console.error('Failed to save user data, adding to queue:', error);
            saveQueue.push(userData);
            console.log('Save queue:', saveQueue);
        }
    } else {
        console.error('Game object is not initialized');
    }
}, 1000);  // Save at most once per second

const processSaveQueue = async () => {
    console.log('Processing save queue...');
    while (saveQueue.length > 0) {
        const userData = saveQueue.shift();  // Get the first item from the queue

        try {
            await fetch('http://localhost:5001/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(userData)
            });
            console.log('Successfully saved queued user data.');
        } catch (error) {
            console.error('Failed to save queued user data, re-adding to queue:', error);
            saveQueue.push(userData);  // Re-add to queue if save fails
            break;  // Exit the loop if save fails
        }
    }
    console.log('Save queue processed.');
};

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const roundNumber = value => {
    return Math.floor(value); // Ensure rounding down to nearest whole number
};

const startGameLoop = () => {
    const processTrades = async () => {
        if (game) {
            game.processTrades(0.1);  // Process trades for 0.1 second intervals
            await updateUI();
            setTimeout(processTrades, 100);  // Schedule next trade processing
        } else {
            console.error('Game object is not initialized');
        }
    };

    const updateUIInterval = async () => {
        await updateUI();
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

document.getElementById('tradeButton').addEventListener('click', async () => {
    if (game) {
        game.manualTrade();
        await updateUI();
        saveUserData();
    } else {
        console.error('Game object is not initialized');
    }
});

document.getElementById('prestigeButton').addEventListener('click', async () => {
    if (game) {
        if (game.prestige()) {
            showNotification('You have prestiged! Your progress is reset but you gain a permanent multiplier.');
        } else {
            showNotification('You need more currency to prestige.');
        }
        await updateUI();
        saveUserData();
    } else {
        console.error('Game object is not initialized');
    }
});

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
