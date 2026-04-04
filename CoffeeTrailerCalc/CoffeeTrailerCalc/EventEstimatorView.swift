import SwiftUI

struct EventEstimatorView: View {
    @EnvironmentObject var store: DataStore
    @State private var showAddEvent = false

    var body: some View {
        NavigationStack {
            List {
                if store.eventEstimates.isEmpty {
                    Section {
                        Text("Plan ahead for farmers markets, festivals, and pop-ups. Tap + to estimate an event.")
                            .foregroundStyle(.secondary)
                    }
                }

                ForEach($store.eventEstimates) { $event in
                    NavigationLink(destination: EventDetailView(event: $event)) {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(event.name).font(.headline)
                                Text("Est. \(event.estimatedDrinks) drinks")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 4) {
                                Text(event.estimatedProfit, format: .currency(code: "USD"))
                                    .font(.headline)
                                    .foregroundStyle(event.estimatedProfit > 0 ? .green : .red)
                                Text("Break-even: \(event.breakEvenDrinks) drinks")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
                .onDelete { offsets in
                    store.eventEstimates.remove(atOffsets: offsets)
                }
            }
            .navigationTitle("Event Estimator")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showAddEvent = true } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddEvent) {
                AddEventView()
            }
        }
    }
}

// MARK: - Event Detail

struct EventDetailView: View {
    @Binding var event: EventEstimate

    var body: some View {
        Form {
            Section("Event Info") {
                TextField("Event Name", text: $event.name)
                HStack {
                    Text("Booth Fee")
                    Spacer()
                    TextField("Fee", value: $event.boothFee, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Extra Costs (ice, travel, etc.)")
                    Spacer()
                    TextField("Extra", value: $event.extraCosts, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
            }

            Section("Drink Estimates") {
                Stepper("Expected drinks: \(event.estimatedDrinks)", value: $event.estimatedDrinks, in: 0...2000, step: 10)
                HStack {
                    Text("Avg Sell Price")
                    Spacer()
                    TextField("Price", value: $event.avgSellPrice, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Avg Cost/Drink")
                    Spacer()
                    TextField("Cost", value: $event.avgCostPerDrink, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
            }

            Section("Projections") {
                SummaryRow(label: "Total Revenue", value: event.totalRevenue, color: .blue)
                SummaryRow(label: "Total Costs", value: event.totalCosts, color: .orange)
                SummaryRow(label: "Estimated Profit", value: event.estimatedProfit, color: event.estimatedProfit > 0 ? .green : .red)
                HStack {
                    Text("Break-even Point")
                        .foregroundStyle(.secondary)
                    Spacer()
                    Text("\(event.breakEvenDrinks) drinks")
                        .bold()
                }
            }
        }
        .navigationTitle(event.name)
    }
}

// MARK: - Add Event

struct AddEventView: View {
    @EnvironmentObject var store: DataStore
    @Environment(\.dismiss) var dismiss

    @State private var name = ""
    @State private var boothFee: Double = 100
    @State private var estimatedDrinks: Int = 100
    @State private var avgSellPrice: Double = 5.50
    @State private var avgCostPerDrink: Double = 1.50
    @State private var extraCosts: Double = 50

    var body: some View {
        NavigationStack {
            Form {
                TextField("Event Name", text: $name)
                HStack {
                    Text("Booth Fee")
                    Spacer()
                    TextField("Fee", value: $boothFee, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                Stepper("Est. drinks: \(estimatedDrinks)", value: $estimatedDrinks, in: 0...2000, step: 10)
                HStack {
                    Text("Avg Sell Price")
                    Spacer()
                    TextField("Price", value: $avgSellPrice, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Avg Cost/Drink")
                    Spacer()
                    TextField("Cost", value: $avgCostPerDrink, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("Extra Costs")
                    Spacer()
                    TextField("Extra", value: $extraCosts, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
            }
            .navigationTitle("New Event")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        let event = EventEstimate(
                            name: name,
                            boothFee: boothFee,
                            estimatedDrinks: estimatedDrinks,
                            avgSellPrice: avgSellPrice,
                            avgCostPerDrink: avgCostPerDrink,
                            extraCosts: extraCosts
                        )
                        store.eventEstimates.append(event)
                        dismiss()
                    }
                    .disabled(name.isEmpty)
                }
            }
        }
    }
}
