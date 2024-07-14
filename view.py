import tkinter as tk
from tkinter import messagebox


class StockExchangeGUI:
    def __init__(self, root, controller):
        self.root = root
        self.controller = controller

        root.title("Stock Exchange Clicker Game")

        self.currency_label = tk.Label(root, text="Currency: 0")
        self.currency_label.pack()

        self.volume_label = tk.Label(root, text="Volume per Click: 1")
        self.volume_label.pack()

        self.automation_label = tk.Label(root, text="Volume per Second: 0")
        self.automation_label.pack()

        self.trade_button = tk.Button(
            root, text="Process Trade", command=self.controller.manual_trade
        )
        self.trade_button.pack()

        self.upgrade_buttons = []
        for i, upgrade in enumerate(self.controller.game.upgrades):
            button = tk.Button(
                root,
                text=upgrade.name,
                command=lambda i=i: self.controller.buy_upgrade(i),
            )
            button.pack()
            self.upgrade_buttons.append(button)

        self.prestige_button = tk.Button(
            root, text="Prestige", command=self.controller.prestige
        )
        self.prestige_button.pack()

        self.prestige_label = tk.Label(
            root,
            text=f"Prestige Multiplier: {self.controller.game.prestige_multiplier}",
        )
        self.prestige_label.pack()

        self.menu_bar = tk.Menu(root)
        self.root.config(menu=self.menu_bar)

        self.file_menu = tk.Menu(self.menu_bar, tearoff=0)
        self.menu_bar.add_cascade(label="File", menu=self.file_menu)
        self.file_menu.add_command(label="Exit", command=root.quit)

        self.update_ui()

    def update_ui(self):
        self.currency_label.config(
            text=f"Currency: {self.controller.format_currency(self.controller.game.currency)}"
        )
        self.volume_label.config(
            text=f"Volume per Click: {self.controller.format_currency(self.controller.game.volume_per_click)}"
        )
        self.automation_label.config(
            text=f"Volume per Second: {self.controller.format_currency(self.controller.game.volume_per_second)}"
        )
        self.prestige_label.config(
            text=f"Prestige Multiplier: {self.controller.format_currency(self.controller.game.prestige_multiplier)}"
        )
        for i, button in enumerate(self.upgrade_buttons):
            upgrade = self.controller.game.upgrades[i]
            button.config(
                text=f"{upgrade.name} ({self.controller.format_currency(upgrade.cost)})"
            )

    def show_upgrade_message(self, success):
        if success:
            messagebox.showinfo("Upgrade", "Upgrade purchased!")
        else:
            messagebox.showwarning("Upgrade", "Not enough funds to purchase upgrade.")

    def show_prestige_message(self, success):
        if success:
            messagebox.showinfo(
                "Prestige",
                "You have prestiged! Your progress is reset but you gain a permanent multiplier.",
            )
        else:
            messagebox.showwarning("Prestige", "You need more currency to prestige.")
