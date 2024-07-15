// ui.js
import { formatNumber, showNotification } from './utils.js';
import { buyUpgrade } from './game.js';

let previousState = {
    currency: null,
    volumePerClick: null,
    volumePerSecond: null,
    prestigeMultiplier: null,
    upgradeCosts: []
};

export const updateUI = async (game) => {
    if (game) {
        if (game.currency !== previousState.currency) {
            document.getElementById('currency').innerText = `Currency: ${formatNumber(game.currency)}`;
            previousState.currency = game.currency;
        }
        if (game.volumePerClick !== previousState.volumePerClick) {
            document.getElementById('volumePerClick').innerText = `Volume per Click: ${formatNumber(game.volumePerClick)}`;
            previousState.volumePerClick = game.volumePerClick;
        }
        if (game.volumePerSecond !== previousState.volumePerSecond) {
            document.getElementById('volumePerSecond').innerText = `Volume per Second: ${formatNumber(game.volumePerSecond)}`;
            previousState.volumePerSecond = game.volumePerSecond;
        }
        if (game.prestigeMultiplier !== previousState.prestigeMultiplier) {
            document.getElementById('prestigeMultiplier').innerText = `Prestige Multiplier: ${formatNumber(game.prestigeMultiplier)}`;
            previousState.prestigeMultiplier = game.prestigeMultiplier;
        }
        if (!arraysEqual(game.upgrades.map(upgrade => upgrade.cost), previousState.upgradeCosts)) {
            document.getElementById('upgrades').innerHTML = '';
            game.upgrades.forEach((upgrade, index) => {
                const button = document.createElement('button');
                button.className = 'btn btn-info btn-block';
                button.innerHTML = `${upgrade.name} <span class="badge badge-light">${formatNumber(upgrade.cost)}</span>`;
                button.addEventListener('click', () => buyUpgrade(index));
                document.getElementById('upgrades').appendChild(button);
            });
            previousState.upgradeCosts = game.upgrades.map(upgrade => upgrade.cost);
        }
    } else {
        console.error('Game object is not initialized');
    }
};

const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};

export const showGame = () => {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
};
