// ui.js
import { formatNumber } from './utils.js';
import { buyUpgradeHandler } from './game.js';

const ELEMENT_IDS = {
    CURRENCY: 'currency',
    VOLUME_PER_CLICK: 'volumePerClick',
    VOLUME_PER_SECOND: 'volumePerSecond',
    PRESTIGE_MULTIPLIER: 'prestigeMultiplier',
    UPGRADES: 'upgrades',
    GAME: 'game',
    REGISTER_FORM: 'registerForm',
    LOGIN_FORM: 'loginForm'
};

let previousState = {
    currency: null,
    volumePerClick: null,
    volumePerSecond: null,
    prestigeMultiplier: null,
    upgradeCosts: []
};

export const updateUI = (game) => {
    if (!game) {
        console.error('Game object is not initialized');
        return;
    }

    updateElement(ELEMENT_IDS.CURRENCY, `Currency: ${formatNumber(game.currency)}`, game.currency !== previousState.currency);
    updateElement(ELEMENT_IDS.VOLUME_PER_CLICK, `Volume per Click: ${formatNumber(game.volumePerClick)}`, game.volumePerClick !== previousState.volumePerClick);
    updateElement(ELEMENT_IDS.VOLUME_PER_SECOND, `Volume per Second: ${formatNumber(game.volumePerSecond)}`, game.volumePerSecond !== previousState.volumePerSecond);
    updateElement(ELEMENT_IDS.PRESTIGE_MULTIPLIER, `Prestige Multiplier: ${formatNumber(game.prestigeMultiplier)}`, game.prestigeMultiplier !== previousState.prestigeMultiplier);

    updateUpgrades(game);

    previousState = { ...game, upgradeCosts: game.upgrades.map(upgrade => upgrade.cost) };
};

const updateElement = (id, content, shouldUpdate) => {
    if (shouldUpdate) {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = content;
        }
    }
};

const updateUpgrades = (game) => {
    const upgradesContainer = document.getElementById(ELEMENT_IDS.UPGRADES);
    if (!upgradesContainer) return;

    if (!arraysEqual(game.upgrades.map(upgrade => upgrade.cost), previousState.upgradeCosts)) {
        upgradesContainer.innerHTML = '';
        game.upgrades.forEach((upgrade, index) => {
            const button = createUpgradeButton(upgrade, index, game.currency);
            upgradesContainer.appendChild(button);
        });
    } else {
        game.upgrades.forEach((upgrade, index) => {
            const button = upgradesContainer.children[index];
            if (button) {
                updateUpgradeButton(button, upgrade, game.currency);
            }
        });
    }
};

const createUpgradeButton = (upgrade, index, currency) => {
    const button = document.createElement('button');
    button.className = 'btn btn-block';
    button.innerHTML = `${upgrade.name} (${upgrade.description}) <span class="badge badge-light">${formatNumber(upgrade.cost)}</span>`;
    button.addEventListener('click', () => buyUpgradeHandler(index));
    updateUpgradeButton(button, upgrade, currency);
    return button;
};

const updateUpgradeButton = (button, upgrade, currency) => {
    if (currency >= upgrade.cost) {
        button.disabled = false;
        button.classList.add('btn-info');
        button.classList.remove('btn-secondary');
    } else {
        button.disabled = true;
        button.classList.add('btn-secondary');
        button.classList.remove('btn-info');
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
    document.getElementById(ELEMENT_IDS.REGISTER_FORM).style.display = 'none';
    document.getElementById(ELEMENT_IDS.LOGIN_FORM).style.display = 'none';
    document.getElementById(ELEMENT_IDS.GAME).style.display = 'block';
};