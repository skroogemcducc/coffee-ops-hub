import SwiftUI

struct DailySalesView: View {
    @EnvironmentObject var store: DataStore
    @State private var showLogSale = false

    var body: some View {
        NavigationStack {
            List {
                if !store.daySummaries.isEmpty {
                    Section("Summary") {
                        let today = store.daySummaries.first(where: {
                            Calendar.current.isDateInToday($0.date)
                        })
                        if let today {
                            VStack(spacing: 12) {
                                Text("Today")
                                    .font(.headline)
                                HStack(spacing: 20) {
                                    StatBubble(title: "Revenue", value: today.totalRevenue, color: .blue)
                                    StatBubble(title: "Costs", value: today.totalCost, color: .orange)
                                    StatBubble(title: "Profit", value: today.totalProfit, color: .green)
                                }
                                Text("\(today.drinksSold) drinks sold")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)

                                if store.dailyFixedCostTarget > 0 {
                                    let pct = min(today.totalProfit / store.dailyFixedCostTarget, 1.0)
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("Daily overhead target: \(store.dailyFixedCostTarget, format: .currency(code: "USD"))")
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                        ProgressView(value: pct)
                                            .tint(pct >= 1.0 ? .green : .orange)
                                    }
                                }
                            }
                            .padding(.vertical, 8)
                        } else {
                            Text("No sales logged today yet.")
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                Section("History") {
                    if store.daySummaries.isEmpty {
                        Text("No sales recorded yet. Tap + to log a sale.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach(store.daySummaries) { day in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(day.date, style: .date)
                                    .font(.subheadline.bold())
                                Text("\(day.drinksSold) drinks")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            VStack(alignment: .trailing) {
                                Text(day.totalRevenue, format: .currency(code: "USD"))
                                    .font(.subheadline)
                                Text(day.totalProfit, format: .currency(code: "USD"))
                                    .font(.caption.bold())
                                    .foregroundStyle(day.totalProfit > 0 ? .green : .red)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Daily Sales")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showLogSale = true } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showLogSale) {
                LogSaleView()
            }
        }
    }
}

struct StatBubble: View {
    let title: String
    let value: Double
    let color: Color

    var body: some View {
        VStack(spacing: 2) {
            Text(title)
                .font(.caption2)
                .foregroundStyle(.secondary)
            Text(value, format: .currency(code: "USD"))
                .font(.subheadline.bold())
                .foregroundStyle(color)
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Log Sale

struct LogSaleView: View {
    @EnvironmentObject var store: DataStore
    @Environment(\.dismiss) var dismiss
    @State private var selectedItemId: UUID?
    @State private var quantity: Int = 1

    var body: some View {
        NavigationStack {
            Form {
                Section("Select Drink") {
                    Picker("Menu Item", selection: $selectedItemId) {
                        Text("Choose...").tag(nil as UUID?)
                        ForEach(store.menuItems) { item in
                            Text("\(item.name) - \(item.sellPrice, format: .currency(code: "USD"))")
                                .tag(item.id as UUID?)
                        }
                    }
                }

                Section("Quantity") {
                    Stepper("\(quantity) drink\(quantity == 1 ? "" : "s")", value: $quantity, in: 1...200)
                }

                if let item = store.menuItems.first(where: { $0.id == selectedItemId }) {
                    Section("Preview") {
                        HStack {
                            Text("Revenue")
                            Spacer()
                            Text(item.sellPrice * Double(quantity), format: .currency(code: "USD"))
                        }
                        HStack {
                            Text("Cost")
                            Spacer()
                            Text(item.totalCost * Double(quantity), format: .currency(code: "USD"))
                        }
                        HStack {
                            Text("Profit")
                            Spacer()
                            Text(item.profit * Double(quantity), format: .currency(code: "USD"))
                                .bold()
                                .foregroundStyle(.green)
                        }
                    }
                }
            }
            .navigationTitle("Log Sale")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Log") {
                        guard let item = store.menuItems.first(where: { $0.id == selectedItemId }) else { return }
                        let sale = DailySale(
                            date: Date(),
                            menuItemId: item.id,
                            menuItemName: item.name,
                            quantity: quantity,
                            revenue: item.sellPrice * Double(quantity),
                            cost: item.totalCost * Double(quantity)
                        )
                        store.dailySales.append(sale)
                        dismiss()
                    }
                    .disabled(selectedItemId == nil)
                }
            }
        }
    }
}
