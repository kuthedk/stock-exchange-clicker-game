// game.js
import { StockExchangeGame } from './stockExchangeGame.js';
import { updateUI, showGame } from './ui.js';
import { registerUser, loginUser, loadUserData, saveUserData, resetUserData, buyUpgrade, processTrade, prestige } from './api.js';
import { debounce, showNotification } from './utils.js';

let token = null;
let user = null;
let game = null;

const loadGame = async () => {
    showGame();
    user = await loadUserData(token);
    // console.log("Loaded user data: ", user);
    game = new StockExchangeGame(user);
    startGameLoop();
    updateUI(game);
};

document.getElementById('registerButton').addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const data = await registerUser(username, password);
    if (data.token) {
        token = data.token;
        user = data.user;
        // console.log("User registered: ", user);
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
        // console.log("User logged in: ", user);
        loadGame();
    } else {
        showNotification(data.message);
    }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    // console.log("User logged out");
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
        // console.log("User reset: ", user);
        game = new StockExchangeGame(user);
        updateUI(game);
        showNotification('Account has been reset.');
    } else {
        showNotification(data.message);
    }
});

document.getElementById('tradeButton').addEventListener('click', async () => {
    game.manualTrade();
    await saveUserData(token, {
        currency: game.currency,
        volumePerClick: game.volumePerClick,
        volumePerSecond: game.volumePerSecond,
        revenuePerTrade: game.revenuePerTrade,
        prestigeMultiplier: game.prestigeMultiplier,
        lastLoggedIn: new Date(),
        upgradeCosts: game.upgrades.map(upgrade => upgrade.cost)
    });
    // console.log("Manual trade processed: ", user);
    updateUI(game);
});

document.getElementById('prestigeButton').addEventListener('click', async () => {
    user = await prestige(token);
    await saveUserData(token, user);
    // console.log("Prestige: ", user);
    game = new StockExchangeGame(user);
    updateUI(game);
});

export const buyUpgradeHandler = async (index) => {
    user = await buyUpgrade(token, index);
    await saveUserData(token, user);
    // console.log("Upgrade purchased: ", user);
    game = new StockExchangeGame(user);
    updateUI(game);
};

const startGameLoop = () => {
    const processTrades = async () => {
        // console.log("Processing trades...");
        game.processTrades();
        await saveUserData(token, {
            currency: game.currency,
            volumePerClick: game.volumePerClick,
            volumePerSecond: game.volumePerSecond,
            revenuePerTrade: game.revenuePerTrade,
            prestigeMultiplier: game.prestigeMultiplier,
            lastLoggedIn: new Date(),
            upgradeCosts: game.upgrades.map(upgrade => upgrade.cost)
        });
        // console.log("Processed trades: ", user);
        updateUI(game);
        setTimeout(processTrades, 1000);  // Process trades every second
    };
    processTrades();
};

document.addEventListener('DOMContentLoaded', async () => {
    if (token) {
        loadGame();
    }
});
