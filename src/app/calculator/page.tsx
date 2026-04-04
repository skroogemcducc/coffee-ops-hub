"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Ingredient {
  id: string;
  name: string;
  costPerUnit: number;
  unitLabel: string;
  quantity: number;
}

interface MenuItem {
  id: string;
  name: string;
  sellPrice: number;
  ingredients: Ingredient[];
  packagingCost: number;
}

interface DailySale {
  id: string;
  date: string;
  menuItemName: string;
  quantity: number;
  revenue: number;
  cost: number;
}

interface FixedExpense {
  id: string;
  name: string;
  monthlyCost: number;
}

interface EventEstimate {
  id: string;
  name: string;
  boothFee: number;
  estimatedDrinks: number;
  avgSellPrice: number;
  avgCostPerDrink: number;
  extraCosts: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uid = () => crypto.randomUUID();
const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const todayStr = () => new Date().toISOString().slice(0, 10);

function itemCost(item: MenuItem) {
  return (
    item.ingredients.reduce((s, i) => s + i.costPerUnit * i.quantity, 0) +
    item.packagingCost
  );
}
function itemProfit(item: MenuItem) {
  return item.sellPrice - itemCost(item);
}
function itemMargin(item: MenuItem) {
  return item.sellPrice > 0
    ? ((itemProfit(item) / item.sellPrice) * 100).toFixed(0)
    : "0";
}

// ─── Persistence ─────────────────────────────────────────────────────────────

function useLocalState<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);

  return [val, setVal];
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const SAMPLE_MENU: MenuItem[] = [
  {
    id: uid(),
    name: "Hot Coffee (12oz)",
    sellPrice: 4.0,
    ingredients: [
      { id: uid(), name: "Coffee beans", costPerUnit: 0.04, unitLabel: "g", quantity: 18 },
    ],
    packagingCost: 0.25,
  },
  {
    id: uid(),
    name: "Iced Latte (16oz)",
    sellPrice: 5.5,
    ingredients: [
      { id: uid(), name: "Espresso beans", costPerUnit: 0.04, unitLabel: "g", quantity: 18 },
      { id: uid(), name: "Milk", costPerUnit: 0.05, unitLabel: "oz", quantity: 10 },
      { id: uid(), name: "Ice", costPerUnit: 0.01, unitLabel: "oz", quantity: 8 },
    ],
    packagingCost: 0.35,
  },
  {
    id: uid(),
    name: "Flavored Latte (16oz)",
    sellPrice: 6.5,
    ingredients: [
      { id: uid(), name: "Espresso beans", costPerUnit: 0.04, unitLabel: "g", quantity: 18 },
      { id: uid(), name: "Milk", costPerUnit: 0.05, unitLabel: "oz", quantity: 10 },
      { id: uid(), name: "Syrup", costPerUnit: 0.2, unitLabel: "pump", quantity: 3 },
      { id: uid(), name: "Ice", costPerUnit: 0.01, unitLabel: "oz", quantity: 8 },
    ],
    packagingCost: 0.35,
  },
];

const SAMPLE_EXPENSES: FixedExpense[] = [
  { id: uid(), name: "Trailer payment", monthlyCost: 800 },
  { id: uid(), name: "Insurance", monthlyCost: 200 },
  { id: uid(), name: "Commissary", monthlyCost: 300 },
  { id: uid(), name: "Phone/POS", monthlyCost: 80 },
];

// ─── Main Page ───────────────────────────────────────────────────────────────

type Tab = "menu" | "sales" | "events" | "overhead";

export default function CalculatorPage() {
  const [tab, setTab] = useState<Tab>("menu");
  const [menu, setMenu] = useLocalState<MenuItem[]>("calc-menu", SAMPLE_MENU);
  const [sales, setSales] = useLocalState<DailySale[]>("calc-sales", []);
  const [expenses, setExpenses] = useLocalState<FixedExpense[]>("calc-expenses", SAMPLE_EXPENSES);
  const [events, setEvents] = useLocalState<EventEstimate[]>("calc-events", []);

  const monthlyOverhead = expenses.reduce((s, e) => s + e.monthlyCost, 0);
  const dailyTarget = monthlyOverhead / 30;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "menu", label: "Menu", icon: "☕" },
    { key: "sales", label: "Sales", icon: "📊" },
    { key: "events", label: "Events", icon: "📅" },
    { key: "overhead", label: "Overhead", icon: "💰" },
  ];

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--ink)" }}>
      {/* Header */}
      <header style={{ padding: "16px 20px 8px", background: "var(--bg-deep)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Coffee Trailer Calculator</h1>
      </header>

      {/* Content */}
      <main style={{ flex: 1, overflow: "auto", padding: "12px 16px 100px" }}>
        {tab === "menu" && <MenuTab menu={menu} setMenu={setMenu} />}
        {tab === "sales" && <SalesTab menu={menu} sales={sales} setSales={setSales} dailyTarget={dailyTarget} />}
        {tab === "events" && <EventsTab events={events} setEvents={setEvents} />}
        {tab === "overhead" && <OverheadTab expenses={expenses} setExpenses={setExpenses} monthlyOverhead={monthlyOverhead} dailyTarget={dailyTarget} menu={menu} />}
      </main>

      {/* Tab bar */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", background: "var(--bg-deep)", borderTop: "1px solid var(--panel-line)",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
      }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: "10px 0 6px", border: "none", background: "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              color: tab === t.key ? "var(--accent)" : "var(--ink-muted)",
              fontWeight: tab === t.key ? 700 : 400, fontSize: 11, cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── Shared UI ───────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "var(--panel-strong)", borderRadius: 12,
  padding: "14px 16px", marginBottom: 10,
  border: "1px solid var(--panel-line)",
};

const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0",
};

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--panel-line)", borderRadius: 8,
  padding: "8px 12px", fontSize: 16, width: "100%",
  background: "var(--surface)", color: "var(--ink)",
};

const btnPrimary: React.CSSProperties = {
  background: "var(--accent)", color: "#fff", border: "none",
  borderRadius: 10, padding: "12px", fontSize: 16,
  fontWeight: 600, width: "100%", cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  ...btnPrimary, background: "var(--accent-secondary)",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-soft)", margin: "18px 0 8px" }}>{children}</h2>;
}

// ─── Menu Tab ────────────────────────────────────────────────────────────────

function MenuTab({ menu, setMenu }: { menu: MenuItem[]; setMenu: (v: MenuItem[] | ((p: MenuItem[]) => MenuItem[])) => void }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [pkg, setPkg] = useState("0.30");

  const handleAdd = () => {
    if (!name || !price) return;
    setMenu((prev) => [...prev, { id: uid(), name, sellPrice: parseFloat(price), ingredients: [], packagingCost: parseFloat(pkg) || 0 }]);
    setName(""); setPrice(""); setPkg("0.30"); setAdding(false);
  };

  const removeItem = (id: string) => setMenu((prev) => prev.filter((m) => m.id !== id));

  const addIngredient = (itemId: string, ing: Ingredient) => {
    setMenu((prev) => prev.map((m) => m.id === itemId ? { ...m, ingredients: [...m.ingredients, ing] } : m));
  };

  const removeIngredient = (itemId: string, ingId: string) => {
    setMenu((prev) => prev.map((m) => m.id === itemId ? { ...m, ingredients: m.ingredients.filter((i) => i.id !== ingId) } : m));
  };

  const updateField = (itemId: string, field: "sellPrice" | "packagingCost", val: number) => {
    setMenu((prev) => prev.map((m) => m.id === itemId ? { ...m, [field]: val } : m));
  };

  if (editing) {
    const item = menu.find((m) => m.id === editing);
    if (!item) { setEditing(null); return null; }
    return <MenuItemDetail item={item} onBack={() => setEditing(null)} addIngredient={addIngredient} removeIngredient={removeIngredient} updateField={updateField} />;
  }

  return (
    <>
      <SectionTitle>Your Menu</SectionTitle>
      {menu.map((item) => (
        <div key={item.id} style={card} onClick={() => setEditing(item.id)}>
          <div style={row}>
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                Cost: {fmt(itemCost(item))} &middot; Sell: {fmt(item.sellPrice)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: itemProfit(item) > 0 ? "var(--accent-secondary)" : "#c44" }}>
                {fmt(itemProfit(item))}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{itemMargin(item)}% margin</div>
            </div>
          </div>
          <div style={{ textAlign: "right", marginTop: 4 }}>
            <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} style={{ background: "none", border: "none", color: "#c44", fontSize: 13, cursor: "pointer" }}>Remove</button>
          </div>
        </div>
      ))}

      {adding ? (
        <div style={card}>
          <input placeholder="Drink name" value={name} onChange={(e) => setName(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input placeholder="Sell price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.25" style={inputStyle} />
            <input placeholder="Packaging $" value={pkg} onChange={(e) => setPkg(e.target.value)} type="number" step="0.05" style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} style={btnPrimary} disabled={!name || !price}>Add</button>
            <button onClick={() => setAdding(false)} style={{ ...btnPrimary, background: "var(--ink-muted)" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={btnSecondary}>+ Add Menu Item</button>
      )}
    </>
  );
}

// ─── Menu Item Detail ────────────────────────────────────────────────────────

function MenuItemDetail({ item, onBack, addIngredient, removeIngredient, updateField }: {
  item: MenuItem;
  onBack: () => void;
  addIngredient: (itemId: string, ing: Ingredient) => void;
  removeIngredient: (itemId: string, ingId: string) => void;
  updateField: (itemId: string, field: "sellPrice" | "packagingCost", val: number) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [ingName, setIngName] = useState("");
  const [ingCost, setIngCost] = useState("0.05");
  const [ingUnit, setIngUnit] = useState("oz");
  const [ingQty, setIngQty] = useState("1");

  const handleAddIng = () => {
    addIngredient(item.id, { id: uid(), name: ingName, costPerUnit: parseFloat(ingCost) || 0, unitLabel: ingUnit, quantity: parseFloat(ingQty) || 0 });
    setIngName(""); setIngCost("0.05"); setIngQty("1"); setShowAdd(false);
  };

  return (
    <>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 15, cursor: "pointer", padding: "4px 0", fontWeight: 600 }}>&larr; Back</button>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "8px 0 12px" }}>{item.name}</h2>

      <SectionTitle>Pricing</SectionTitle>
      <div style={card}>
        <div style={{ ...row, gap: 8 }}>
          <span>Sell Price</span>
          <input type="number" step="0.25" value={item.sellPrice} onChange={(e) => updateField(item.id, "sellPrice", parseFloat(e.target.value) || 0)} style={{ ...inputStyle, width: 100, textAlign: "right" }} />
        </div>
        <div style={{ ...row, gap: 8 }}>
          <span>Packaging</span>
          <input type="number" step="0.05" value={item.packagingCost} onChange={(e) => updateField(item.id, "packagingCost", parseFloat(e.target.value) || 0)} style={{ ...inputStyle, width: 100, textAlign: "right" }} />
        </div>
      </div>

      <SectionTitle>Ingredients</SectionTitle>
      {item.ingredients.map((ing) => (
        <div key={ing.id} style={{ ...card, padding: "10px 14px" }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{ing.name}</div>
          <div style={{ ...row, fontSize: 13, color: "var(--ink-muted)" }}>
            <span>{ing.quantity} {ing.unitLabel} @ {fmt(ing.costPerUnit)}/{ing.unitLabel}</span>
            <span style={{ fontWeight: 600, color: "var(--ink)" }}>{fmt(ing.costPerUnit * ing.quantity)}</span>
          </div>
          <button onClick={() => removeIngredient(item.id, ing.id)} style={{ background: "none", border: "none", color: "#c44", fontSize: 12, cursor: "pointer", padding: 0 }}>Remove</button>
        </div>
      ))}

      {showAdd ? (
        <div style={card}>
          <input placeholder="Ingredient name" value={ingName} onChange={(e) => setIngName(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <input placeholder="$/unit" value={ingCost} onChange={(e) => setIngCost(e.target.value)} type="number" step="0.01" style={inputStyle} />
            <select value={ingUnit} onChange={(e) => setIngUnit(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
              {["oz", "g", "pump", "each", "splash"].map((u) => <option key={u}>{u}</option>)}
            </select>
            <input placeholder="Qty" value={ingQty} onChange={(e) => setIngQty(e.target.value)} type="number" step="0.5" style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAddIng} style={btnPrimary} disabled={!ingName}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{ ...btnPrimary, background: "var(--ink-muted)" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} style={{ ...btnSecondary, marginBottom: 12 }}>+ Add Ingredient</button>
      )}

      <SectionTitle>Summary</SectionTitle>
      <div style={card}>
        <div style={row}><span style={{ color: "var(--ink-muted)" }}>Total Cost</span><span style={{ fontWeight: 700 }}>{fmt(itemCost(item))}</span></div>
        <div style={row}><span style={{ color: "var(--ink-muted)" }}>Profit/Drink</span><span style={{ fontWeight: 700, color: itemProfit(item) > 0 ? "var(--accent-secondary)" : "#c44" }}>{fmt(itemProfit(item))}</span></div>
        <div style={row}><span style={{ color: "var(--ink-muted)" }}>Margin</span><span style={{ fontWeight: 700 }}>{itemMargin(item)}%</span></div>
      </div>
    </>
  );
}

// ─── Sales Tab ───────────────────────────────────────────────────────────────

function SalesTab({ menu, sales, setSales, dailyTarget }: {
  menu: MenuItem[];
  sales: DailySale[];
  setSales: (v: DailySale[] | ((p: DailySale[]) => DailySale[])) => void;
  dailyTarget: number;
}) {
  const [logging, setLogging] = useState(false);
  const [selId, setSelId] = useState("");
  const [qty, setQty] = useState(1);

  const today = todayStr();
  const todaySales = sales.filter((s) => s.date === today);
  const todayRevenue = todaySales.reduce((s, x) => s + x.revenue, 0);
  const todayCost = todaySales.reduce((s, x) => s + x.cost, 0);
  const todayProfit = todayRevenue - todayCost;
  const todayDrinks = todaySales.reduce((s, x) => s + x.quantity, 0);

  const dayGroups = sales.reduce<Record<string, DailySale[]>>((acc, s) => {
    (acc[s.date] ??= []).push(s);
    return acc;
  }, {});
  const sortedDays = Object.keys(dayGroups).sort((a, b) => b.localeCompare(a));

  const handleLog = () => {
    const item = menu.find((m) => m.id === selId);
    if (!item) return;
    setSales((prev) => [...prev, {
      id: uid(), date: today, menuItemName: item.name, quantity: qty,
      revenue: item.sellPrice * qty, cost: itemCost(item) * qty,
    }]);
    setQty(1); setSelId(""); setLogging(false);
  };

  const pct = dailyTarget > 0 ? Math.min(todayProfit / dailyTarget, 1) : 0;

  return (
    <>
      <SectionTitle>Today</SectionTitle>
      <div style={card}>
        <div style={{ display: "flex", gap: 8, textAlign: "center", marginBottom: 8 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: "var(--ink-muted)" }}>Revenue</div><div style={{ fontWeight: 700, color: "var(--accent)" }}>{fmt(todayRevenue)}</div></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: "var(--ink-muted)" }}>Costs</div><div style={{ fontWeight: 700 }}>{fmt(todayCost)}</div></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: "var(--ink-muted)" }}>Profit</div><div style={{ fontWeight: 700, color: "var(--accent-secondary)" }}>{fmt(todayProfit)}</div></div>
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-muted)", textAlign: "center" }}>{todayDrinks} drinks sold</div>
        {dailyTarget > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 4 }}>Overhead target: {fmt(dailyTarget)}</div>
            <div style={{ background: "var(--line-soft)", borderRadius: 6, height: 10, overflow: "hidden" }}>
              <div style={{ width: `${pct * 100}%`, height: "100%", borderRadius: 6, background: pct >= 1 ? "var(--accent-secondary)" : "var(--accent-tertiary)", transition: "width 0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {logging ? (
        <div style={card}>
          <select value={selId} onChange={(e) => setSelId(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }}>
            <option value="">Choose drink...</option>
            {menu.map((m) => <option key={m.id} value={m.id}>{m.name} – {fmt(m.sellPrice)}</option>)}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ ...btnPrimary, width: 44, padding: 8 }}>−</button>
            <span style={{ fontSize: 20, fontWeight: 700, minWidth: 30, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ ...btnPrimary, width: 44, padding: 8 }}>+</button>
          </div>
          {selId && (
            <div style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 8 }}>
              {(() => { const m = menu.find((x) => x.id === selId); return m ? `Revenue: ${fmt(m.sellPrice * qty)} · Profit: ${fmt(itemProfit(m) * qty)}` : ""; })()}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleLog} style={btnPrimary} disabled={!selId}>Log Sale</button>
            <button onClick={() => setLogging(false)} style={{ ...btnPrimary, background: "var(--ink-muted)" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setLogging(true)} style={btnSecondary}>+ Log Sale</button>
      )}

      <SectionTitle>History</SectionTitle>
      {sortedDays.length === 0 && <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>No sales yet.</p>}
      {sortedDays.map((day) => {
        const daySales = dayGroups[day];
        const rev = daySales.reduce((s, x) => s + x.revenue, 0);
        const prof = daySales.reduce((s, x) => s + x.revenue - x.cost, 0);
        const drinks = daySales.reduce((s, x) => s + x.quantity, 0);
        return (
          <div key={day} style={card}>
            <div style={row}>
              <div>
                <div style={{ fontWeight: 600 }}>{new Date(day + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{drinks} drinks</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div>{fmt(rev)}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: prof > 0 ? "var(--accent-secondary)" : "#c44" }}>{fmt(prof)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ─── Events Tab ──────────────────────────────────────────────────────────────

function EventsTab({ events, setEvents }: {
  events: EventEstimate[];
  setEvents: (v: EventEstimate[] | ((p: EventEstimate[]) => EventEstimate[])) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [fee, setFee] = useState("100");
  const [drinks, setDrinks] = useState("100");
  const [avgPrice, setAvgPrice] = useState("5.50");
  const [avgCost, setAvgCost] = useState("1.50");
  const [extra, setExtra] = useState("50");

  const handleAdd = () => {
    setEvents((prev) => [...prev, {
      id: uid(), name, boothFee: parseFloat(fee) || 0,
      estimatedDrinks: parseInt(drinks) || 0,
      avgSellPrice: parseFloat(avgPrice) || 0,
      avgCostPerDrink: parseFloat(avgCost) || 0,
      extraCosts: parseFloat(extra) || 0,
    }]);
    setName(""); setAdding(false);
  };

  const removeEvent = (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <>
      <SectionTitle>Event Estimates</SectionTitle>
      {events.length === 0 && !adding && <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>Plan ahead for markets, festivals, and pop-ups.</p>}

      {events.map((ev) => {
        const totalRev = ev.estimatedDrinks * ev.avgSellPrice;
        const totalCost = ev.estimatedDrinks * ev.avgCostPerDrink + ev.boothFee + ev.extraCosts;
        const profit = totalRev - totalCost;
        const profitPerDrink = ev.avgSellPrice - ev.avgCostPerDrink;
        const breakEven = profitPerDrink > 0 ? Math.ceil((ev.boothFee + ev.extraCosts) / profitPerDrink) : 0;

        return (
          <div key={ev.id} style={card}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{ev.name}</div>
            <div style={row}><span style={{ color: "var(--ink-muted)" }}>Revenue</span><span>{fmt(totalRev)}</span></div>
            <div style={row}><span style={{ color: "var(--ink-muted)" }}>Total Costs</span><span>{fmt(totalCost)}</span></div>
            <div style={row}>
              <span style={{ color: "var(--ink-muted)" }}>Profit</span>
              <span style={{ fontWeight: 700, color: profit > 0 ? "var(--accent-secondary)" : "#c44" }}>{fmt(profit)}</span>
            </div>
            <div style={{ ...row, borderTop: "1px solid var(--line-soft)", paddingTop: 8, marginTop: 4 }}>
              <span style={{ color: "var(--ink-muted)" }}>Break-even</span>
              <span style={{ fontWeight: 700 }}>{breakEven} drinks</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 4 }}>
              {ev.estimatedDrinks} drinks est. &middot; Booth: {fmt(ev.boothFee)} &middot; Extra: {fmt(ev.extraCosts)}
            </div>
            <button onClick={() => removeEvent(ev.id)} style={{ background: "none", border: "none", color: "#c44", fontSize: 13, cursor: "pointer", marginTop: 6, padding: 0 }}>Remove</button>
          </div>
        );
      })}

      {adding ? (
        <div style={card}>
          <input placeholder="Event name" value={name} onChange={(e) => setName(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div><label style={{ fontSize: 12, color: "var(--ink-muted)" }}>Booth Fee</label><input value={fee} onChange={(e) => setFee(e.target.value)} type="number" style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, color: "var(--ink-muted)" }}>Est. Drinks</label><input value={drinks} onChange={(e) => setDrinks(e.target.value)} type="number" style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, color: "var(--ink-muted)" }}>Avg Sell Price</label><input value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)} type="number" step="0.25" style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, color: "var(--ink-muted)" }}>Avg Cost/Drink</label><input value={avgCost} onChange={(e) => setAvgCost(e.target.value)} type="number" step="0.25" style={inputStyle} /></div>
          </div>
          <div><label style={{ fontSize: 12, color: "var(--ink-muted)" }}>Extra Costs (ice, travel)</label><input value={extra} onChange={(e) => setExtra(e.target.value)} type="number" style={{ ...inputStyle, marginBottom: 10 }} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} style={btnPrimary} disabled={!name}>Add Event</button>
            <button onClick={() => setAdding(false)} style={{ ...btnPrimary, background: "var(--ink-muted)" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={btnSecondary}>+ New Event Estimate</button>
      )}
    </>
  );
}

// ─── Overhead Tab ────────────────────────────────────────────────────────────

function OverheadTab({ expenses, setExpenses, monthlyOverhead, dailyTarget, menu }: {
  expenses: FixedExpense[];
  setExpenses: (v: FixedExpense[] | ((p: FixedExpense[]) => FixedExpense[])) => void;
  monthlyOverhead: number;
  dailyTarget: number;
  menu: MenuItem[];
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  const handleAdd = () => {
    setExpenses((prev) => [...prev, { id: uid(), name, monthlyCost: parseFloat(cost) || 0 }]);
    setName(""); setCost(""); setAdding(false);
  };

  const removeExpense = (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  return (
    <>
      <SectionTitle>Monthly Fixed Costs</SectionTitle>
      {expenses.map((exp) => (
        <div key={exp.id} style={{ ...card, padding: "10px 14px" }}>
          <div style={row}>
            <span>{exp.name}</span>
            <span style={{ fontWeight: 600 }}>{fmt(exp.monthlyCost)}</span>
          </div>
          <button onClick={() => removeExpense(exp.id)} style={{ background: "none", border: "none", color: "#c44", fontSize: 12, cursor: "pointer", padding: 0 }}>Remove</button>
        </div>
      ))}

      {adding ? (
        <div style={card}>
          <input placeholder="Expense name" value={name} onChange={(e) => setName(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
          <input placeholder="Monthly cost" value={cost} onChange={(e) => setCost(e.target.value)} type="number" style={{ ...inputStyle, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} style={btnPrimary} disabled={!name}>Add</button>
            <button onClick={() => setAdding(false)} style={{ ...btnPrimary, background: "var(--ink-muted)" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ ...btnSecondary, marginBottom: 12 }}>+ Add Expense</button>
      )}

      <SectionTitle>Targets</SectionTitle>
      <div style={card}>
        <div style={row}><span style={{ color: "var(--ink-muted)" }}>Monthly Overhead</span><span style={{ fontWeight: 700, color: "var(--accent)" }}>{fmt(monthlyOverhead)}</span></div>
        <div style={row}><span style={{ color: "var(--ink-muted)" }}>Daily Target</span><span style={{ fontWeight: 700 }}>{fmt(dailyTarget)}</span></div>
        <div style={row}><span style={{ color: "var(--ink-muted)" }}>Weekly Target</span><span style={{ fontWeight: 700 }}>{fmt(monthlyOverhead / 4)}</span></div>
      </div>

      <SectionTitle>Break-Even by Drink</SectionTitle>
      <div style={card}>
        {menu.filter((m) => itemProfit(m) > 0).map((m) => {
          const perDay = Math.ceil(dailyTarget / itemProfit(m));
          const perMonth = Math.ceil(monthlyOverhead / itemProfit(m));
          return (
            <div key={m.id} style={{ ...row, borderBottom: "1px solid var(--line-soft)" }}>
              <span style={{ fontSize: 14 }}>{m.name}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{perDay}/day</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{perMonth}/mo</div>
              </div>
            </div>
          );
        })}
        {menu.filter((m) => itemProfit(m) > 0).length === 0 && (
          <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>Add profitable menu items to see break-even.</p>
        )}
      </div>
    </>
  );
}
