// ============================================================
//  BudgetTracker.jsx — Beginner-friendly React Budget App
//  Concepts used:
//    1. useState      — store & update data
//    2. useEffect     — run code when something changes
//    3. localStorage  — save data in the browser (no backend)
//    4. Props         — pass data into reusable components
//    5. .map()        — loop over arrays to render lists
//    6. .filter()     — get only income or only expense items
//    7. .reduce()     — add up totals from an array
// ============================================================

import { useState, useEffect } from "react";

// ─────────────────────────────────────────
//  REUSABLE CHILD COMPONENT (uses Props)
//  Props are like function arguments for components.
//  App.jsx passes values in; this component just displays them.
//
//  Usage in parent:  <SummaryCard label="Income" amount={3000} color="green" />
// ─────────────────────────────────────────
function SummaryCard({ label, amount, color }) {
  const cardStyle = {
    flex: 1,
    background: "var(--color-background-primary)",
    border: `0.5px solid var(--color-border-tertiary)`,
    borderTop: `3px solid ${color}`,
    borderRadius: 12,
    padding: "1rem 1.25rem",
    minWidth: 0,
  };
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: color }}>
        ${amount.toLocaleString()}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  REUSABLE CHILD COMPONENT
//  Renders a single row in the transaction list.
//  onDelete is a function passed as a prop — calling it
//  tells the parent (App) to remove this item.
// ─────────────────────────────────────────
function TransactionRow({ item, onDelete }) {
  const isIncome = item.type === "income";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 1.25rem",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
          {item.description || item.category}
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
          {item.category} · {item.date}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontWeight: 600, color: isIncome ? "#0d9488" : "#e11d48" }}>
          {isIncome ? "+" : "-"}${item.amount}
        </span>
        {/* onDelete is called with this item's id when × is clicked */}
        <button
          onClick={() => onDelete(item.id)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--color-text-secondary)" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  MAIN COMPONENT (Parent / App)
// ─────────────────────────────────────────
function BudgetTracker1() {

  // ── useState ──────────────────────────
  // useState(initialValue) returns [currentValue, setterFunction]
  // When you call the setter, React re-renders the component.

  // Load saved transactions from localStorage on first render,
  // or use sample data if nothing is saved yet.
                                const [transactions, setTransactions] = useState(() => {
                                  const saved = localStorage.getItem("budget_transactions");
                                  return saved
                                    ? JSON.parse(saved)
                                    : [
                                        { id: 1, type: "income",  category: "Salary",    amount: 5000, description: "Monthly salary",  date: "2026-05-01" },
                                        { id: 2, type: "expense", category: "Food",      amount: 320,  description: "Groceries",        date: "2026-05-05" },
                                        { id: 3, type: "income",  category: "Freelance", amount: 800,  description: "Design project",   date: "2026-05-10" },
                                        { id: 4, type: "expense", category: "Transport", amount: 90,   description: "Monthly pass",     date: "2026-05-03" },
                                      ];
                                });

  // Form fields — one state object for all inputs
  const [form, setForm] = useState({
    type: "expense",
    category: "Food",
    amount: "",
    description: "",
    date: "",
  });

  // Controls whether the "Add Transaction" form is visible
  const [showForm, setShowForm] = useState(false);

  // ── useEffect ─────────────────────────
  // Runs the function inside whenever [transactions] changes.
  // Here: saves the updated list to localStorage every time
  // a transaction is added or deleted.
  useEffect(() => {
    localStorage.setItem("budget_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ── Calculations (no useMemo needed at your level) ──
  // .filter() picks only items where type === "income"
  // .reduce() adds all their amounts together starting from 0
                                          const totalIncome = transactions
                                            .filter((t) => t.type === "income")
                                            .reduce((total, t) => total + t.amount, 0);

                                          const totalExpense = transactions
                                            .filter((t) => t.type === "expense")
                                            .reduce((total, t) => total + t.amount, 0);

                                          const balance = totalIncome - totalExpense;

  // ── Event Handlers ────────────────────

  // Called when a form input changes — updates only that field
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // If type changes, reset category to a valid option
    if (name === "type") {
      setForm((prev) => ({
        ...prev,
        type: value,
        category: value === "income" ? "Salary" : "Food",
      }));
    }
  }

  // Called when "Add" button is clicked
  function handleAdd() {
    if (!form.amount || !form.date) {
      alert("Please fill in amount and date!");
      return;
    }
    const newTransaction = {
      id: Date.now(),           // unique ID from timestamp
      type: form.type,
      category: form.category,
      amount: parseFloat(form.amount),
      description: form.description,
      date: form.date,
    };
    // Add new item to the front of the array
    setTransactions((prev) => [newTransaction, ...prev]);
    // Reset the form
    setForm({ type: "expense", category: "Food", amount: "", description: "", date: "" });
    setShowForm(false);
  }

  // Called from TransactionRow via onDelete prop
  function handleDelete(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  // ── Categories based on type ──────────
  const expenseCategories = ["Food", "Housing", "Transport", "Healthcare", "Entertainment", "Shopping", "Utilities", "Other"];
  const incomeCategories  = ["Salary", "Freelance", "Investment", "Gift", "Other Income"];
  const categories = form.type === "income" ? incomeCategories : expenseCategories;

  // ── Inline styles ──────────────────────
                                                  const inputStyle = {
                                                    width: "100%",
                                                    padding: "8px 12px",
                                                    border: "0.5px solid var(--color-border-tertiary)",
                                                    borderRadius: 8,
                                                    fontSize: 14,
                                                    background: "var(--color-background-secondary)",
                                                    color: "var(--color-text-primary)",
                                                    marginBottom: "0.75rem",
                                                    boxSizing: "border-box",
                                                  };

  // ── JSX (what gets rendered) ───────────
  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 660, margin: "0 auto", padding: "1.5rem 0.75rem" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>💰 Budget Tracker</h1>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>May 2026</p>
        </div>
        {/* Toggle the form on/off */}
        <button
          onClick={() => setShowForm((prev) => !prev)}
          style={{ background: "#0d9488", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          {showForm ? "✕ Cancel" : "+ Add Transaction"}
        </button>
      </div>

      {/* ── Summary Cards (SummaryCard component + props) ── */}
                                                  <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                                                    <SummaryCard label="Total Income"   amount={totalIncome}  color="#0d9488" />
                                                    <SummaryCard label="Total Expenses" amount={totalExpense} color="#e11d48" />
                                                    <SummaryCard label="Net Balance"    amount={balance}      color={balance >= 0 ? "#6366f1" : "#e11d48"} />
                                                  </div>

      {/* ── Add Transaction Form (only shown when showForm is true) ── */}
      {showForm && (
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem", fontSize: 15, fontWeight: 600 }}>New Transaction</h3>

          {/* Type toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: "0.75rem" }}>
            {["expense", "income"].map((t) => (
              <button
                key={t}
                onClick={() => setForm((prev) => ({ ...prev, type: t, category: t === "income" ? "Salary" : "Food" }))}
                style={{
                  flex: 1, padding: "8px", border: "none", borderRadius: 6, cursor: "pointer",
                  fontWeight: 600, fontSize: 13, textTransform: "capitalize",
                  background: form.type === t ? (t === "income" ? "#0d9488" : "#e11d48") : "var(--color-background-secondary)",
                  color: form.type === t ? "#fff" : "var(--color-text-secondary)",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount input — name="amount" matches the key in form state */}
          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Amount ($)</label>
          <input type="number" name="amount" placeholder="0.00" value={form.amount} onChange={handleChange} style={inputStyle} />

          {/* Category dropdown — options change based on type */}
          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Category</label>
          <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
            {/* .map() turns the array into <option> elements */}
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Description (optional)</label>
          <input type="text" name="description" placeholder="What was this for?" value={form.description} onChange={handleChange} style={inputStyle} />

          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} style={{ ...inputStyle, marginBottom: "1rem" }} />

          <button
            onClick={handleAdd}
            style={{ width: "100%", padding: "10px", background: form.type === "income" ? "#0d9488" : "#e11d48", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Add {form.type === "income" ? "Income ↑" : "Expense ↓"}
          </button>
        </div>
      )}

      {/* ── Transaction List ── */}
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 1.25rem", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 14, fontWeight: 600 }}>
          Transactions ({transactions.length})
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)", fontSize: 14 }}>
            No transactions yet. Add one above!
          </div>
        ) : (
          // .map() loops over transactions and renders a TransactionRow for each one
          // Each child in a list needs a unique "key" prop — React uses it internally
          transactions.map((item) => (
            <TransactionRow
              key={item.id}
              item={item}
              onDelete={handleDelete}    // passing a function as a prop
            />
          ))
        )}
      </div>

      {/* ── Quick tip ── */}
      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center", marginTop: "1rem" }}>
        💾 Data is saved in your browser's localStorage automatically.
      </p>
    </div>
  );
}

export default BudgetTracker1;
