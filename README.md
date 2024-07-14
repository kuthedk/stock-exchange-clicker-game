
# Stock Exchange Clicker Game

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Setting up MongoDB](#setting-up-mongodb)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Get User Data](#get-user-data)
  - [Update User Data](#update-user-data)
  - [Reset User Data](#reset-user-data)
- [Technologies Used](#technologies-used)
- [License](#license)

## Overview

Stock Exchange Clicker Game is a web-based incremental game where players act as the exchange and process trades to earn currency, buy upgrades, and achieve higher levels of prestige. The game has a frontend for user interaction and a backend for user authentication, data persistence, and game logic.

## Features

- User registration and login
- Incremental stock trading
- Upgrades to enhance trading capabilities
- Prestige system for advanced gameplay
- Data persistence with MongoDB
- Responsive design

## Project Structure

```plaintext
stock-exchange-clicker-game/
├── backend/
│   ├── .env
│   ├── index.js
│   ├── models/
│   │   └── User.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   └── user.js
│   ├── package.json
├── frontend/
│   ├── index.html
│   ├── game.js
│   ├── style.css
│   ├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/stock-exchange-clicker-game.git
    cd stock-exchange-clicker-game
    ```

2. **Backend Setup**:

    ```bash
    cd backend
    npm install
    ```

3. **Frontend Setup**:

    ```bash
    cd ../frontend
    npm install
    ```

### Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
SECRET_KEY=your_secret_key
MONGO_URI=mongodb://localhost:27017/stock-exchange-clicker
PORT=5001
```

### Setting up MongoDB

1. **Download MongoDB**:
   - Go to the [MongoDB Download Center](https://www.mongodb.com/try/download/community) and download the MongoDB Community Server for your operating system.

2. **Install MongoDB**:
   - Follow the installation instructions for your operating system:
     - [Windows Installation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
     - [macOS Installation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
     - [Linux Installation](https://docs.mongodb.com/manual/administration/install-on-linux/)

3. **Run MongoDB**:
   - After installation, start the MongoDB server by running the following command in your terminal or command prompt:
     ```bash
     mongod
     ```
   - This will start the MongoDB server on the default port (27017).

## Usage

1. **Start the Backend Server**:

    ```bash
    cd backend
    node index.js
    ```

    You should see a message indicating that the server is running on port 5001.

2. **Open the Frontend**:

    Open `index.html` in your web browser to start playing the game.

## API Endpoints

### User Registration

- **URL**: `/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "username": "string",
      "password": "string"
  }
  ```
- **Response**:
  ```json
  {
      "token": "string",
      "user": {
          "id": "string",
          "username": "string"
      }
  }
  ```

### User Login

- **URL**: `/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "username": "string",
      "password": "string"
  }
  ```
- **Response**:
  ```json
  {
      "token": "string",
      "user": {
          "id": "string",
          "username": "string"
      }
  }
  ```

### Get User Data

- **URL**: `/user`
- **Method**: `GET`
- **Headers**:
  ```json
  {
      "x-auth-token": "string"
  }
  ```

### Update User Data

- **URL**: `/user`
- **Method**: `PUT`
- **Headers**:
  ```json
  {
      "x-auth-token": "string"
  }
  ```
- **Body**:
  ```json
  {
      "currency": "number",
      "volumePerClick": "number",
      "volumePerSecond": "number",
      "revenuePerTrade": "number",
      "prestigeMultiplier": "number",
      "lastLoggedIn": "date",
      "upgradeCosts": ["number"]
  }
  ```

### Reset User Data

- **URL**: `/reset`
- **Method**: `POST`
- **Headers**:
  ```json
  {
      "x-auth-token": "string"
  }
  ```

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, MongoDB
- Authentication: JWT

## License

This project is closed-source and not open for public use. All rights reserved.
