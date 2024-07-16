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

export const roundNumber = value => Math.floor(value);

export const formatNumber = value => {
    if (value < 1000000) return new Intl.NumberFormat().format(value);

    const units = [
        "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion",
        "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion",
        "tredecillion", "quattuordecillion", "quindecillion", "sexdecillion", "septendecillion",
        "octodecillion", "novemdecillion", "vigintillion", "unvigintillion", "duovigintillion"
    ];
    let unitIndex = -1;
    let reducedValue = value;

    while (reducedValue >= 1000000) {
        reducedValue /= 1000;
        unitIndex++;
    }

    return reducedValue.toFixed(3) + ' ' + units[unitIndex];
};

export const showNotification = message => {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
};
