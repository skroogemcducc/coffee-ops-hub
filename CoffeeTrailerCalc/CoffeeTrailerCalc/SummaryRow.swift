import SwiftUI

struct SummaryRow: View {
    let label: String
    let value: Double
    var color: Color = .primary

    var body: some View {
        HStack {
            Text(label)
                .foregroundStyle(.secondary)
            Spacer()
            Text(value, format: .currency(code: "USD"))
                .bold()
                .foregroundStyle(color)
        }
    }
}
