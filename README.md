# Stock Exchange Clicker Game

A web-based stock exchange clicker game where users can register, log in, and track their own progress. Users can earn passive income even while logged out, with their data securely stored on the backend.

## Features

- User registration and login with secure JWT authentication
- Persistent game state using MongoDB
- Passive income tracking while logged out (up to 1 hour)
- Linear and exponential upgrades to enhance gameplay
- Prestige system for long-term progression
- Responsive frontend using HTML, CSS, and JavaScript

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Frontend: HTML, CSS, JavaScript

## Installation

### Backend

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd stock-exchange-clicker-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up MongoDB:

    Ensure MongoDB is installed and running on your machine, or set up a MongoDB Atlas account.

4. Start the server:

    ```bash
    node index.js
    ```

### Frontend

1. Serve the frontend files:

    Simply open `index.html` in a web browser, or use a static hosting service like GitHub Pages, Netlify, or Vercel.
