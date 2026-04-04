import Foundation

class DataStore: ObservableObject {
    @Published var menuItems: [MenuItem] {
        didSet { save() }
    }
    @Published var dailySales: [DailySale] {
        didSet { save() }
    }
    @Published var fixedExpenses: [FixedExpense] {
        didSet { save() }
    }
    @Published var eventEstimates: [EventEstimate] {
        didSet { save() }
    }

    private let menuKey = "menuItems"
    private let salesKey = "dailySales"
    private let expensesKey = "fixedExpenses"
    private let eventsKey = "eventEstimates"

    init() {
        self.menuItems = Self.load(key: "menuItems") ?? Self.sampleMenu()
        self.dailySales = Self.load(key: "dailySales") ?? []
        self.fixedExpenses = Self.load(key: "fixedExpenses") ?? Self.sampleExpenses()
        self.eventEstimates = Self.load(key: "eventEstimates") ?? []
    }

    private func save() {
        Self.encode(menuItems, key: menuKey)
        Self.encode(dailySales, key: salesKey)
        Self.encode(fixedExpenses, key: expensesKey)
        Self.encode(eventEstimates, key: eventsKey)
    }

    private static func encode<T: Encodable>(_ value: T, key: String) {
        if let data = try? JSONEncoder().encode(value) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }

    private static func load<T: Decodable>(key: String) -> T? {
        guard let data = UserDefaults.standard.data(forKey: key) else { return nil }
        return try? JSONDecoder().decode(T.self, from: data)
    }

    // MARK: - Day Summaries

    var daySummaries: [DaySummary] {
        let calendar = Calendar.current
        let grouped = Dictionary(grouping: dailySales) {
            calendar.startOfDay(for: $0.date)
        }
        return grouped.map { date, sales in
            DaySummary(
                date: date,
                totalRevenue: sales.reduce(0) { $0 + $1.revenue },
                totalCost: sales.reduce(0) { $0 + $1.cost },
                totalProfit: sales.reduce(0) { $0 + $1.profit },
                drinksSold: sales.reduce(0) { $0 + $1.quantity }
            )
        }.sorted { $0.date > $1.date }
    }

    var totalMonthlyFixedCosts: Double {
        fixedExpenses.reduce(0) { $0 + $1.monthlyCost }
    }

    var dailyFixedCostTarget: Double {
        totalMonthlyFixedCosts / 30.0
    }

    // MARK: - Sample Data

    static func sampleMenu() -> [MenuItem] {
        [
            MenuItem(
                name: "Hot Coffee (12oz)",
                sellPrice: 4.00,
                ingredients: [
                    Ingredient(name: "Coffee beans", costPerUnit: 0.04, unitLabel: "g", quantity: 18),
                ],
                packagingCost: 0.25
            ),
            MenuItem(
                name: "Iced Latte (16oz)",
                sellPrice: 5.50,
                ingredients: [
                    Ingredient(name: "Espresso beans", costPerUnit: 0.04, unitLabel: "g", quantity: 18),
                    Ingredient(name: "Milk", costPerUnit: 0.05, unitLabel: "oz", quantity: 10),
                    Ingredient(name: "Ice", costPerUnit: 0.01, unitLabel: "oz", quantity: 8),
                ],
                packagingCost: 0.35
            ),
            MenuItem(
                name: "Flavored Latte (16oz)",
                sellPrice: 6.50,
                ingredients: [
                    Ingredient(name: "Espresso beans", costPerUnit: 0.04, unitLabel: "g", quantity: 18),
                    Ingredient(name: "Milk", costPerUnit: 0.05, unitLabel: "oz", quantity: 10),
                    Ingredient(name: "Syrup", costPerUnit: 0.20, unitLabel: "pump", quantity: 3),
                    Ingredient(name: "Ice", costPerUnit: 0.01, unitLabel: "oz", quantity: 8),
                ],
                packagingCost: 0.35
            ),
        ]
    }

    static func sampleExpenses() -> [FixedExpense] {
        [
            FixedExpense(name: "Trailer payment", monthlyCost: 800),
            FixedExpense(name: "Insurance", monthlyCost: 200),
            FixedExpense(name: "Commissary", monthlyCost: 300),
            FixedExpense(name: "Phone/POS", monthlyCost: 80),
        ]
    }
}
