import threading
import time
from model import StockExchangeGame

class StockExchangeController:
    def __init__(self, view):
        self.view = view
        self.game = StockExchangeGame()

    def start_game_loop(self):
        def game_loop():
            while True:
                self.game.process_trades(1)
                time.sleep(1)
        game_thread = threading.Thread(target=game_loop)
        game_thread.daemon = True
        game_thread.start()

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
