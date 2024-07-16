// api.js
export const registerUser = async (username, password) => {
    const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};

export const loginUser = async (username, password) => {
    const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};

export const loadUserData = async (token) => {
    const response = await fetch('http://localhost:5001/api/user', {
        method: 'GET',
        headers: { 'x-auth-token': token },
    });
    return response.json();
};

export const saveUserData = async (token, userData) => {
    await fetch('http://localhost:5001/api/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify(userData)
    });
};

export const resetUserData = async (token) => {
    const response = await fetch('http://localhost:5001/api/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    });
    return response.json();
};

export const buyUpgrade = async (token, upgradeIndex) => {
    const response = await fetch('http://localhost:5001/api/buy-upgrade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({ upgradeIndex })
    });
    return response.json();
};

export const processTrade = async (token) => {
    const response = await fetch('http://localhost:5001/api/process-trade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    });
    return response.json();
};

export const prestige = async (token) => {
    const response = await fetch('http://localhost:5001/api/prestige', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    });
    return response.json();
};
