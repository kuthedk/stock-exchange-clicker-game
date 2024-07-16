// utils.js
export const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const formatNumber = (value) => {
    if (value < 1000000) return new Intl.NumberFormat().format(Math.floor(value));

    const units = [
        "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion",
        "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion",
        "tredecillion", "quattuordecillion", "quindecillion", "sexdecillion", "septendecillion",
        "octodecillion", "novemdecillion", "vigintillion"
    ];
    let unitIndex = 0;
    let scaledValue = value;

    while (scaledValue >= 1000000 && unitIndex < units.length - 1) {
        unitIndex++;
        scaledValue /= 1000;
    }

    return scaledValue.toFixed(3) + ' ' + units[unitIndex];
};

export const showNotification = (message) => {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.innerText = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    } else {
        console.warn('Notification element not found');
    }
};

export const logger = {
    log: (message) => console.log(`[LOG] ${new Date().toISOString()}: ${message}`),
    error: (message) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`),
    warn: (message) => console.warn(`[WARN] ${new Date().toISOString()}: ${message}`),
};