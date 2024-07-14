import tkinter as tk
import logging
from controller import StockExchangeController
from view import StockExchangeGUI

logging.basicConfig(level=logging.DEBUG)

if __name__ == "__main__":
    root = tk.Tk()
    controller = StockExchangeController(None)
    app = StockExchangeGUI(root, controller)
    controller.view = app
    logging.debug("View has been set in the controller")
    controller.start_game_loop()
    root.mainloop()
