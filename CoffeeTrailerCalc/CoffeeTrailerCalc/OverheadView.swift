import SwiftUI

struct OverheadView: View {
    @EnvironmentObject var store: DataStore
    @State private var showAddExpense = false

    var body: some View {
        NavigationStack {
            List {
                Section("Monthly Fixed Costs") {
                    ForEach($store.fixedExpenses) { $expense in
                        HStack {
                            TextField("Name", text: $expense.name)
                            Spacer()
                            TextField("Cost", value: $expense.monthlyCost, format: .currency(code: "USD"))
                                .keyboardType(.decimalPad)
                                .multilineTextAlignment(.trailing)
                                .frame(width: 100)
                        }
                    }
                    .onDelete { offsets in
                        store.fixedExpenses.remove(atOffsets: offsets)
                    }

                    Button("Add Expense") { showAddExpense = true }
                }

                Section("Totals") {
                    SummaryRow(label: "Monthly Overhead", value: store.totalMonthlyFixedCosts, color: .orange)
                    SummaryRow(label: "Daily Target (to cover overhead)", value: store.dailyFixedCostTarget, color: .blue)
                    HStack {
                        Text("Weekly Target")
                            .foregroundStyle(.secondary)
                        Spacer()
                        Text(store.totalMonthlyFixedCosts / 4.0, format: .currency(code: "USD"))
                            .bold()
                    }
                }

                Section("Break-Even by Drink") {
                    if store.menuItems.isEmpty {
                        Text("Add menu items to see break-even analysis.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach(store.menuItems) { item in
                        if item.profit > 0 {
                            let drinksPerDay = Int(ceil(store.dailyFixedCostTarget / item.profit))
                            let drinksPerMonth = Int(ceil(store.totalMonthlyFixedCosts / item.profit))
                            HStack {
                                Text(item.name)
                                    .font(.subheadline)
                                Spacer()
                                VStack(alignment: .trailing) {
                                    Text("\(drinksPerDay)/day")
                                        .font(.subheadline.bold())
                                    Text("\(drinksPerMonth)/month")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Overhead")
            .sheet(isPresented: $showAddExpense) {
                AddExpenseView()
            }
        }
    }
}

// MARK: - Add Expense

struct AddExpenseView: View {
    @EnvironmentObject var store: DataStore
    @Environment(\.dismiss) var dismiss
    @State private var name = ""
    @State private var monthlyCost: Double = 0

    var body: some View {
        NavigationStack {
            Form {
                TextField("Expense Name", text: $name)
                HStack {
                    Text("Monthly Cost")
                    Spacer()
                    TextField("Cost", value: $monthlyCost, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
            }
            .navigationTitle("New Expense")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        store.fixedExpenses.append(FixedExpense(name: name, monthlyCost: monthlyCost))
                        dismiss()
                    }
                    .disabled(name.isEmpty)
                }
            }
        }
    }
}
