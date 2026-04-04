import SwiftUI

struct MenuCostView: View {
    @EnvironmentObject var store: DataStore
    @State private var showAddItem = false

    var body: some View {
        NavigationStack {
            List {
                ForEach(store.menuItems) { item in
                    NavigationLink(destination: MenuItemDetailView(item: binding(for: item))) {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(item.name)
                                    .font(.headline)
                                Text("Cost: \(item.totalCost, format: .currency(code: "USD")) | Sell: \(item.sellPrice, format: .currency(code: "USD"))")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 4) {
                                Text(item.profit, format: .currency(code: "USD"))
                                    .font(.headline)
                                    .foregroundStyle(item.profit > 0 ? .green : .red)
                                Text("\(item.marginPercent, specifier: "%.0f")% margin")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
                .onDelete { offsets in
                    store.menuItems.remove(atOffsets: offsets)
                }
            }
            .navigationTitle("Menu & Costs")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showAddItem = true } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddItem) {
                AddMenuItemView()
            }
        }
    }

    private func binding(for item: MenuItem) -> Binding<MenuItem> {
        guard let index = store.menuItems.firstIndex(where: { $0.id == item.id }) else {
            return .constant(item)
        }
        return $store.menuItems[index]
    }
}

// MARK: - Detail / Edit View

struct MenuItemDetailView: View {
    @Binding var item: MenuItem
    @State private var showAddIngredient = false

    var body: some View {
        Form {
            Section("Pricing") {
                HStack {
                    Text("Sell Price")
                    Spacer()
                    TextField("Price", value: $item.sellPrice, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Packaging Cost")
                    Spacer()
                    TextField("Cost", value: $item.packagingCost, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
            }

            Section("Ingredients") {
                ForEach($item.ingredients) { $ingredient in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(ingredient.name).font(.subheadline.bold())
                        HStack {
                            Text("\(ingredient.quantity, specifier: "%.1f") \(ingredient.unitLabel) @ \(ingredient.costPerUnit, format: .currency(code: "USD"))/\(ingredient.unitLabel)")
                                .font(.caption)
                            Spacer()
                            Text(ingredient.costPerUnit * ingredient.quantity, format: .currency(code: "USD"))
                                .font(.caption.bold())
                        }
                    }
                }
                .onDelete { offsets in
                    item.ingredients.remove(atOffsets: offsets)
                }

                Button("Add Ingredient") { showAddIngredient = true }
            }

            Section("Summary") {
                SummaryRow(label: "Total Cost", value: item.totalCost, color: .primary)
                SummaryRow(label: "Profit per Drink", value: item.profit, color: item.profit > 0 ? .green : .red)
                HStack {
                    Text("Margin")
                    Spacer()
                    Text("\(item.marginPercent, specifier: "%.1f")%")
                        .bold()
                        .foregroundStyle(item.marginPercent >= 70 ? .green : item.marginPercent >= 50 ? .orange : .red)
                }
            }
        }
        .navigationTitle(item.name)
        .sheet(isPresented: $showAddIngredient) {
            AddIngredientView { ingredient in
                item.ingredients.append(ingredient)
            }
        }
    }
}

// MARK: - Add Menu Item

struct AddMenuItemView: View {
    @EnvironmentObject var store: DataStore
    @Environment(\.dismiss) var dismiss
    @State private var name = ""
    @State private var sellPrice: Double = 5.00
    @State private var packagingCost: Double = 0.30

    var body: some View {
        NavigationStack {
            Form {
                TextField("Drink Name", text: $name)
                HStack {
                    Text("Sell Price")
                    Spacer()
                    TextField("Price", value: $sellPrice, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Packaging Cost")
                    Spacer()
                    TextField("Cost", value: $packagingCost, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
            }
            .navigationTitle("New Menu Item")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        let item = MenuItem(name: name, sellPrice: sellPrice, ingredients: [], packagingCost: packagingCost)
                        store.menuItems.append(item)
                        dismiss()
                    }
                    .disabled(name.isEmpty)
                }
            }
        }
    }
}

// MARK: - Add Ingredient

struct AddIngredientView: View {
    @Environment(\.dismiss) var dismiss
    var onAdd: (Ingredient) -> Void

    @State private var name = ""
    @State private var costPerUnit: Double = 0.05
    @State private var unitLabel = "oz"
    @State private var quantity: Double = 1.0

    let unitOptions = ["oz", "g", "pump", "each", "splash"]

    var body: some View {
        NavigationStack {
            Form {
                TextField("Ingredient Name", text: $name)
                Picker("Unit", selection: $unitLabel) {
                    ForEach(unitOptions, id: \.self) { Text($0) }
                }
                HStack {
                    Text("Cost per \(unitLabel)")
                    Spacer()
                    TextField("Cost", value: $costPerUnit, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Quantity (\(unitLabel))")
                    Spacer()
                    TextField("Qty", value: $quantity, format: .number)
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                Section("Preview") {
                    Text("Total: \(costPerUnit * quantity, format: .currency(code: "USD"))")
                }
            }
            .navigationTitle("Add Ingredient")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        onAdd(Ingredient(name: name, costPerUnit: costPerUnit, unitLabel: unitLabel, quantity: quantity))
                        dismiss()
                    }
                    .disabled(name.isEmpty)
                }
            }
        }
    }
}
