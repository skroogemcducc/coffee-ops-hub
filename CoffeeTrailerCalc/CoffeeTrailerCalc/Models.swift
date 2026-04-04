import Foundation

// MARK: - Menu Item & Ingredients

struct Ingredient: Identifiable, Codable {
    var id = UUID()
    var name: String
    var costPerUnit: Double   // e.g. cost per oz, per pump, per each
    var unitLabel: String     // "oz", "pump", "each"
    var quantity: Double      // how many units used in this drink
}

struct MenuItem: Identifiable, Codable {
    var id = UUID()
    var name: String
    var sellPrice: Double
    var ingredients: [Ingredient]
    var packagingCost: Double  // cup + lid + sleeve + straw

    var totalCost: Double {
        ingredients.reduce(0) { $0 + $1.costPerUnit * $1.quantity } + packagingCost
    }

    var profit: Double {
        sellPrice - totalCost
    }

    var marginPercent: Double {
        guard sellPrice > 0 else { return 0 }
        return (profit / sellPrice) * 100
    }
}

// MARK: - Daily Sales

struct DailySale: Identifiable, Codable {
    var id = UUID()
    var date: Date
    var menuItemId: UUID
    var menuItemName: String
    var quantity: Int
    var revenue: Double
    var cost: Double

    var profit: Double { revenue - cost }
}

struct DaySummary: Identifiable {
    var id: Date { date }
    var date: Date
    var totalRevenue: Double
    var totalCost: Double
    var totalProfit: Double
    var drinksSold: Int
}

// MARK: - Fixed Expenses

struct FixedExpense: Identifiable, Codable {
    var id = UUID()
    var name: String
    var monthlyCost: Double
}

// MARK: - Event Estimate

struct EventEstimate: Identifiable, Codable {
    var id = UUID()
    var name: String
    var boothFee: Double
    var estimatedDrinks: Int
    var avgSellPrice: Double
    var avgCostPerDrink: Double
    var extraCosts: Double  // ice, extra supplies, travel

    var totalRevenue: Double { Double(estimatedDrinks) * avgSellPrice }
    var totalCosts: Double { Double(estimatedDrinks) * avgCostPerDrink + boothFee + extraCosts }
    var estimatedProfit: Double { totalRevenue - totalCosts }
    var breakEvenDrinks: Int {
        guard avgSellPrice > avgCostPerDrink else { return 0 }
        return Int(ceil((boothFee + extraCosts) / (avgSellPrice - avgCostPerDrink)))
    }
}
