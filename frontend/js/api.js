// api.js
const API_BASE_URL = 'http://localhost:5001/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const registerUser = async (username, password) => {
  return apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const loginUser = async (username, password) => {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const loadUserData = async (token) => {
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    const response = await fetch('http://localhost:5001/api/user', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': token 
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to load user data');
    }
    return response.json();
  } catch (error) {
    console.error('Load user data error:', error);
    throw error;
  }
};

export const saveUserData = async (token, userData) => {
  return apiRequest('/user', {
    method: 'PUT',
    headers: { 'x-auth-token': token },
    body: JSON.stringify(userData),
  });
};

export const resetUserData = async (token) => {
  return apiRequest('/reset', {
    method: 'POST',
    headers: { 'x-auth-token': token },
  });
};

export const buyUpgrade = async (token, upgradeIndex) => {
  return apiRequest('/buy-upgrade', {
    method: 'POST',
    headers: { 'x-auth-token': token },
    body: JSON.stringify({ upgradeIndex }),
  });
};

export const processTrade = async (token) => {
  return apiRequest('/process-trade', {
    method: 'POST',
    headers: { 'x-auth-token': token },
  });
};

export const prestige = async (token) => {
  return apiRequest('/prestige', {
    method: 'POST',
    headers: { 'x-auth-token': token },
  });
};