# Stock Exchange Clicker Game

This is a personal repository for the **Stock Exchange Clicker Game**, an incremental clicker game where you manage a stock exchange, automate trades, and strategically upgrade to reach new heights.

## Features
- **Manual Trading**: Start by manually processing trades to earn currency.
- **Automation Upgrades**: Purchase upgrades to automate trade processing and increase your revenue per trade.
- **Strategic Growth**: Carefully choose upgrades to maximize your earnings and navigate through exponential growth.
- **Prestige System**: Prestige to reset your progress and gain permanent multipliers, encouraging repeated cycles of growth.
- **S-Curve Progression**: Experience a gameplay curve that starts slow, grows exponentially, and then focuses on strategic upgrades and prestige.

## Project Structure
stock_exchange_clicker/  
├── controller.py # Handles the interaction between the model and the view  
├── main.py # Entry point of the application, sets up the GUI and initializes MVC components  
├── model.py # Contains the game logic, including manual trading, automation, upgrades, and prestige  
└── view.py # Manages the graphical user interface using tkinter

perl
Copy code

## Getting Started
1. Clone the repository:
    ```
    git clone https://github.com/yourusername/stock-exchange-clicker-game.git
    ```
2. Navigate to the project directory:
    ```
    cd stock-exchange-clicker-game
    ```
3. Run the game:
    ```
    python main.py
    ```

## Requirements
- Python 3.x
- `tkinter` (included with Python standard library)