import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';
import './styles.css';
import Home from "../pages/Home";
import Navbar from "../components/Navbar";
import V1 from "../pages/V1";
import V2 from "../pages/V2";
import Budget from "../pages/Budget";
import Transactions from "../pages/Transactions";
import Tracker from "../components/Tracker";

const EXPENSE_CATS = ["Food", "Transport", "Entertainment", "Shopping", "Other Expense"];
const INCOME_CATS  = ["Salary", "Freelance", "Gift", "Other Income"];

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("budget_transactions");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, type: "income",  category: "Salary",    amount: 5000, description: "Monthly salary", date: "2026-05-01" },
          { id: 2, type: "expense", category: "Food",      amount: 320,  description: "Groceries",       date: "2026-05-05" },
          { id: 3, type: "income",  category: "Freelance", amount: 800,  description: "Design project",  date: "2026-05-10" },
          { id: 4, type: "expense", category: "Transport", amount: 90,   description: "Monthly pass",    date: "2026-05-03" },
        ];
  });

  // Floating + button form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "expense", category: "Food", amount: "", description: "", date: ""
  });

  useEffect(() => {
    localStorage.setItem("budget_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Categories change based on income or expense type
  const categories = form.type === "income" ? INCOME_CATS : EXPENSE_CATS;

  function handleAdd() {
    if (!form.amount || !form.date) {
      alert("Please fill in amount and date!");
      return;
    }
    setTransactions(prev => [{
      id: Date.now(),
      type: form.type,
      category: form.category,
      amount: parseFloat(form.amount),
      description: form.description,
      date: form.date,
    }, ...prev]);
    // Reset form and close modal
    setForm({ type: "expense", category: "Food", amount: "", description: "", date: "" });
    setShowForm(false);
  }

  const inputStyle = {
    width: "100%", padding: "8px 12px",
    border: "0.5px solid #2a0a40", borderRadius: 8,
    fontSize: 14, background: "#0d0019",
    color: "white", marginBottom: "0.75rem",
    boxSizing: "border-box",
  };

  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Tracker transactions={transactions} />

      <Routes>
        {/* Pass transactions (and setter) to every page that needs them */}
        <Route path='/' element={<Home transactions={transactions}/>}/>
        <Route path='/Transactions' element={<Transactions transactions={transactions} setTransactions={setTransactions}/>}/>
        <Route path='/Budget' element={<Budget transactions={transactions}/>}/>
      </Routes>

      {/* ── Floating + button (fixed = stays on screen while scrolling) ── */}
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: "fixed", bottom: 28, right: 28,
          width: 56, height: 56, borderRadius: "50%",
          background: "#0d9488", color: "white",
          border: "none", fontSize: 28,
          cursor: "pointer", zIndex: 1000,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        +
      </button>

      {/* ── Modal — only shown when showForm is true ── */}
      {showForm && (
        // Clicking the dark overlay (not the card) closes the modal
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1001, padding: "1rem",
          }}
        >
          <div style={{
            background: "#1c0430", borderRadius: 16,
            padding: "1.5rem", width: "100%", maxWidth: 400,
            boxSizing: "border-box",
          }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "white" }}>New Transaction</h3>
              <button onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", color: "white", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>
                ×
              </button>
            </div>

            {/* Income / Expense toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: "0.75rem" }}>
              {["expense", "income"].map(t => (
                <button key={t}
                  onClick={() => setForm(prev => ({ ...prev, type: t, category: t === "income" ? "Salary" : "Food" }))}
                  style={{
                    flex: 1, padding: "8px", border: "none", borderRadius: 6,
                    cursor: "pointer", fontWeight: 600, fontSize: 13,
                    textTransform: "capitalize",
                    background: form.type === t ? (t === "income" ? "#0d9488" : "#e11d48") : "#2a0a40",
                    color: "white",
                  }}>
                  {t}
                </button>
              ))}
            </div>

            <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Amount (Rs.)</label>
            <input type="number" placeholder="0.00" value={form.amount}
              onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
              style={inputStyle} />

            <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Category</label>
            <select value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
              style={inputStyle}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Description (optional)</label>
            <input type="text" placeholder="What was this for?" value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              style={inputStyle} />

            <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Date</label>
            <input type="date" value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              style={{ ...inputStyle, marginBottom: "1rem" }} />

            <button onClick={handleAdd}
              style={{
                width: "100%", padding: "10px",
                background: form.type === "income" ? "#0d9488" : "#e11d48",
                color: "white", border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>
              Add {form.type === "income" ? "Income ↑" : "Expense ↓"}
            </button>
          </div>
        </div>
      )}

    </BrowserRouter>
    </>
  );
}

export default App;