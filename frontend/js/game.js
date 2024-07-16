// game.js
import { StockExchangeGame } from './stockExchangeGame.js';
import { updateUI, showGame } from './ui.js';
import { registerUser, loginUser, loadUserData, saveUserData, resetUserData, buyUpgrade, processTrade, prestige } from './api.js';
import { debounce, showNotification } from './utils.js';

let token = null;
let user = null;

const loadGame = async () => {
    showGame();
    user = await loadUserData(token);
    updateUI(user);
    startGameLoop();
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

document.getElementById('logoutButton').addEventListener('click', () => {
    token = null;
    user = null;
    document.getElementById('game').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('resetButton').addEventListener('click', async () => {
    const data = await resetUserData(token);
    if (data.user) {
        user = data.user;
        updateUI(user);
        showNotification('Account has been reset.');
    } else {
        showNotification(data.message);
    }
});

document.getElementById('tradeButton').addEventListener('click', async () => {
    user.currency += user.volumePerClick * user.prestigeMultiplier * user.revenuePerTrade;
    await saveUserData(token, user);
    updateUI(user);
});

document.getElementById('prestigeButton').addEventListener('click', async () => {
    user = await prestige(token);
    await saveUserData(token, user);
    updateUI(user);
});

export const buyUpgradeHandler = async (index) => {
    user = await buyUpgrade(token, index);
    await saveUserData(token, user);
    updateUI(user);
};

const startGameLoop = () => {
    const processTrades = async () => {
        user = await processTrade(token);
        updateUI(user);
        setTimeout(processTrades, 100); // Process trades every 100 milliseconds
    };
    processTrades();
};

document.addEventListener('DOMContentLoaded', async () => {
    if (token) {
        loadGame();
    }
});
