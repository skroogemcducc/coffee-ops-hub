import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            MenuCostView()
                .tabItem {
                    Label("Menu", systemImage: "cup.and.saucer.fill")
                }

            DailySalesView()
                .tabItem {
                    Label("Sales", systemImage: "chart.bar.fill")
                }

            EventEstimatorView()
                .tabItem {
                    Label("Events", systemImage: "calendar")
                }

            OverheadView()
                .tabItem {
                    Label("Overhead", systemImage: "dollarsign.circle.fill")
                }
        }
        .tint(.brown)
    }
}
