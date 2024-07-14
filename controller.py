import logging
from model import StockExchangeGame

logging.basicConfig(level=logging.DEBUG)


class StockExchangeController:
    def __init__(self, view):
        self.view = view
        self.game = StockExchangeGame()
        self.is_running = True

    def start_game_loop(self):
        logging.debug("Starting game loop")
        self.schedule_next_trade_process()
        self.schedule_next_ui_update()

    def stop_game_loop(self):
        self.is_running = False

    def schedule_next_trade_process(self):
        if self.is_running:
            self.view.root.after(
                100, self.process_trades
            )  # Schedule trade processing every 100ms

    def schedule_next_ui_update(self):
        if self.is_running:
            self.view.root.after(100, self.update_ui)  # Schedule UI updates every 100ms

    def process_trades(self):
        if self.is_running:
            self.game.process_trades(0.1)  # Process trades for 0.1 second intervals
            self.schedule_next_trade_process()

    def update_ui(self):
        if self.is_running:
            self.view.update_ui()
            self.view.root.update_idletasks()
            self.schedule_next_ui_update()

    def buy_upgrade(self, upgrade_index):
        success = self.game.buy_upgrade(upgrade_index)
        self.view.show_upgrade_message(success)
        self.update_ui()

    def manual_trade(self):
        self.game.manual_trade()
        self.update_ui()

    def format_currency(self, value):
        return self.game.format_currency(value)

    def prestige(self):
        success = self.game.prestige()
        self.view.show_prestige_message(success)
        self.update_ui()
