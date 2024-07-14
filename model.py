from decimal import Decimal, getcontext

# Set precision for Decimal operations
getcontext().prec = 50

# List of large number names
number_names = [
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
    "sextillion",
    "septillion",
    "octillion",
    "nonillion",
    "decillion",
    "undecillion",
    "duodecillion",
    "tredecillion",
    "quattuordecillion",
    "quindecillion",
    "sexdecillion",
    "septendecillion",
    "octodecillion",
    "novemdecillion",
    "vigintillion",
    "unvigintillion",
    "duovigintillion",
]


class Upgrade:
    def __init__(self, name, effect, cost, apply_upgrade):
        self.name = name
        self.effect = effect
        self.cost = cost
        self.apply_upgrade = apply_upgrade

    def purchase(self, game):
        if game.currency >= self.cost:
            game.currency -= self.cost
            self.apply_upgrade(game)
            return True
        return False


class StockExchangeGame:
    def __init__(self):
        self.currency = Decimal(0)
        self.volume_per_click = Decimal(1)
        self.volume_per_second = Decimal(0)  # Starts at 0 for no automation initially
        self.revenue_per_trade = Decimal(1)  # Initial revenue per trade set to 1
        self.upgrade_cost = Decimal(100)
        self.prestige_multiplier = Decimal(1)
        self.prestige_threshold = Decimal(1000000)
        self.upgrades = self.create_upgrades()

    def create_upgrades(self):
        return [
            Upgrade(
                "Increase Click Volume",
                "Doubles volume per click",
                Decimal(100),
                self.apply_click_volume_upgrade,
            ),
            Upgrade(
                "Basic Automation",
                "Adds 10 volume per second",
                Decimal(500),
                self.apply_basic_automation_upgrade,
            ),
            Upgrade(
                "HFT Algorithms",
                "Doubles volume per second",
                Decimal(5000),
                self.apply_hft_upgrade,
            ),
            Upgrade(
                "Automated Trade Matching Engine",
                "Increases revenue per trade by 50%",
                Decimal(25000),
                self.apply_matching_engine_upgrade,
            ),
            # Add more upgrades here
        ]

    def apply_click_volume_upgrade(self, game):
        game.volume_per_click *= Decimal(2)

    def apply_basic_automation_upgrade(self, game):
        game.volume_per_second += Decimal(10)  # Introduce basic automation

    def apply_hft_upgrade(self, game):
        game.volume_per_second *= Decimal(2)

    def apply_matching_engine_upgrade(self, game):
        game.revenue_per_trade *= Decimal(1.5)

    def process_trades(self, seconds):
        trades = self.volume_per_second * Decimal(seconds) * self.prestige_multiplier
        revenue = trades * self.revenue_per_trade
        self.currency += revenue

    def manual_trade(self):
        trades = self.volume_per_click * self.prestige_multiplier
        revenue = trades * self.revenue_per_trade
        self.currency += revenue

    def buy_upgrade(self, upgrade_index):
        upgrade = self.upgrades[upgrade_index]
        return upgrade.purchase(self)

    def format_currency(self, value):
        if value < 1000:
            return f"{value:.0f}"  # Display small values as whole numbers
        exponent = (value.log10() // 3 * 3).to_integral_exact()
        mantissa = value / (Decimal(10) ** exponent)
        mantissa_str = f"{mantissa:.3f}".rstrip("0").rstrip(".")
        name_index = int(exponent // 3) - 1
        name = (
            number_names[name_index]
            if name_index < len(number_names)
            else f"10^{int(exponent)}"
        )
        return f"{mantissa_str} {name}"

    def prestige(self):
        if self.currency >= self.prestige_threshold:
            self.currency = Decimal(0)
            self.volume_per_click = Decimal(1)
            self.volume_per_second = Decimal(0)
            self.revenue_per_trade = Decimal(1)
            self.prestige_multiplier *= Decimal(2)
            return True
        return False
