// game.js
import { StockExchangeGame } from './stockExchangeGame.js';
import { updateUI, showGame } from './ui.js';
import { registerUser, loginUser, loadUserData, saveUserData, resetUserData, buyUpgrade, processTrade, prestige } from './api.js';
import { debounce, showNotification } from './utils.js';

let token = null;
let user = null;
let game = null;

const eventBus = {
  events: {},
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
};

const loadGame = async () => {
  showGame();
  try {
    console.log('Loading user data with token:', token);
    user = await loadUserData(token);
    console.log('User data loaded:', user);
    game = new StockExchangeGame(user);
    updateUI(game);
    startGameLoop();
    eventBus.emit('gameLoaded', game);
  } catch (error) {
    console.error('Failed to load game data:', error);
    showNotification('Failed to load game data: ' + error.message);
  }
};

document.getElementById('registerButton').addEventListener('click', async () => {
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  try {
    const data = await registerUser(username, password);
    if (data.token) {
      token = data.token;
      user = data.user;
      loadGame();
    }
  } catch (error) {
    showNotification(error.message || 'Registration failed');
  }
});

document.getElementById('loginButton').addEventListener('click', async () => {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const data = await loginUser(username, password);
    if (data.token) {
      token = data.token;
      localStorage.setItem('token', token);
      user = data.user;
      console.log('Login successful, token:', token);
      loadGame();
    }
  } catch (error) {
    console.error('Login failed:', error);
    showNotification(error.message || 'Login failed');
  }
});

document.getElementById('logoutButton').addEventListener('click', () => {
  token = null;
  user = null;
  game = null;
  localStorage.removeItem('token');
  document.getElementById('game').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('loginForm').style.display = 'block';
  eventBus.emit('logout');
});

document.getElementById('resetButton').addEventListener('click', async () => {
  try {
    const data = await resetUserData(token);
    if (data.user) {
      user = data.user;
      game = new StockExchangeGame(user);
      updateUI(game);
      showNotification('Account has been reset.');
      eventBus.emit('gameReset', game);
    }
  } catch (error) {
    showNotification(error.message || 'Reset failed');
  }
});

document.getElementById('tradeButton').addEventListener('click', async () => {
  game.manualTrade();
  updateUI(game);
  try {
    await saveUserData(token, game.toJSON());
  } catch (error) {
    showNotification('Failed to save trade data');
  }
});

document.getElementById('prestigeButton').addEventListener('click', async () => {
  try {
    user = await prestige(token);
    game.syncWithUser(user);
    updateUI(game);
    eventBus.emit('prestige', game);
  } catch (error) {
    showNotification('Prestige failed');
  }
});

export const buyUpgradeHandler = async (index) => {
  try {
    user = await buyUpgrade(token, index);
    game.syncWithUser(user);
    updateUI(game);
    eventBus.emit('upgradeBought', { index, game });
  } catch (error) {
    showNotification('Failed to buy upgrade');
  }
};

const startGameLoop = () => {
  let lastUpdate = Date.now();
  const gameLoop = () => {
    const now = Date.now();
    const deltaTime = now - lastUpdate;
    lastUpdate = now;

    game.update(deltaTime);
    updateUI(game);

    requestAnimationFrame(gameLoop);
  };
  gameLoop();
};

document.addEventListener('DOMContentLoaded', async () => {
  token = localStorage.getItem('token');
  if (token) {
    loadGame();
  }
});

eventBus.on('gameLoaded', (game) => {
  console.log('Game loaded:', game);
});

export { eventBus };