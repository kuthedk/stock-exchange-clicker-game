// game.js
import { StockExchangeGame } from './stockExchangeGame.js';
import { updateUI, showGame } from './ui.js';
import { registerUser, loginUser, loadUserData, saveUserData, resetUserData } from './api.js';
import { debounce, showNotification } from './utils.js';

let token = null;
let user = null;
let game = null;
let saveQueue = [];

const loadGame = async () => {
    showGame();
    user = await loadUserData(token);
    game = new StockExchangeGame(user);
    startGameLoop();
    updateUI(game);
};

export const buyUpgrade = async (index) => {
    if (game && game.buyUpgrade(index)) {
        showNotification('Upgrade purchased!');
    } else {
        showNotification('Not enough funds to purchase upgrade.');
    }
    await updateUI(game);
    saveUserDataDebounced();
};

document.getElementById('registerButton').addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const data = await registerUser(username, password);
    if (data.token) {
        token = data.token;
        user = data.user;
        loadGame();
    } else {
        showNotification(data.message);
    }
});

document.getElementById('loginButton').addEventListener('click', async () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const data = await loginUser(username, password);
    if (data.token) {
        token = data.token;
        user = data.user;
        loadGame();
    } else {
        showNotification(data.message);
    }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    await processSaveQueue();
    token = null;
    user = null;
    game = null;
    document.getElementById('game').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('resetButton').addEventListener('click', async () => {
    const data = await resetUserData(token);
    if (data.user) {
        user = data.user;
        game = new StockExchangeGame(user);
        updateUI(game);
        showNotification('Account has been reset.');
    } else {
        showNotification(data.message);
    }
});

document.getElementById('tradeButton').addEventListener('click', async () => {
    game.manualTrade();
    updateUI(game);
    saveUserDataDebounced();
});

document.getElementById('prestigeButton').addEventListener('click', async () => {
    if (game.prestige()) {
        showNotification('You have prestiged! Your progress is reset but you gain a permanent multiplier.');
    } else {
        showNotification('You need more currency to prestige.');
    }
    updateUI(game);
    saveUserDataDebounced();
});

const saveUserDataDebounced = debounce(async () => {
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
        await saveUserData(token, userData);
    } catch (error) {
        saveQueue.push(userData);
    }
}, 1000);

const processSaveQueue = async () => {
    while (saveQueue.length > 0) {
        const userData = saveQueue.shift();
        try {
            await saveUserData(token, userData);
        } catch (error) {
            saveQueue.push(userData);
            break;
        }
    }
};

const startGameLoop = () => {
    const processTrades = async () => {
        game.processTrades(0.1);
        await updateUI(game);
        setTimeout(processTrades, 100);
    };
    processTrades();
};

document.addEventListener('DOMContentLoaded', async () => {
    if (token) {
        loadGame();
    }
});
