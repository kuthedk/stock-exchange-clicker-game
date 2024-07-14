import tkinter as tk
from controller import StockExchangeController
from view import StockExchangeGUI

if __name__ == "__main__":
    root = tk.Tk()
    controller = StockExchangeController(None)
    app = StockExchangeGUI(root, controller)
    controller.view = app
    root.mainloop()
