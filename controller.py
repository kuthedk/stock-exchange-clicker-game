import logging
from model import StockExchangeGame

logging.basicConfig(level=logging.DEBUG)


class StockExchangeController:
    def __init__(self, view):
        self.view = view
        self.game = StockExchangeGame()
        self.is_running = False

    def start_game_loop(self):
        logging.debug("Starting game loop")
        self.is_running = True
        self.schedule_next_game_loop()

    def stop_game_loop(self):
        self.is_running = False

    def schedule_next_game_loop(self):
        if self.is_running:
            self.view.root.after(
                100, self.game_loop
            )  # Schedule next call in 100 milliseconds

    def game_loop(self):
        self.game.process_trades(0.1)  # Process trades for 0.1 second intervals
        self.view.update_ui()
        self.schedule_next_game_loop()

    def buy_upgrade(self, upgrade_index):
        success = self.game.buy_upgrade(upgrade_index)
        self.view.show_upgrade_message(success)
        self.view.update_ui()

    def manual_trade(self):
        self.game.manual_trade()
        self.view.update_ui()

    def format_currency(self, value):
        return self.game.format_currency(value)

    def prestige(self):
        success = self.game.prestige()
        self.view.show_prestige_message(success)
        self.view.update_ui()
