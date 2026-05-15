import { useState } from "react";
import '../src/styles.css';

const EXPENSE_CATS = ["Food", "Transport", "Entertainment", "Shopping", "Other Expense"];
const INCOME_CATS  = ["Salary", "Freelance", "Gift", "Other Income"];

// Self-contained component — only needs setTransactions passed in from App.jsx
function AddButton({ setTransactions }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "expense", category: "Food", amount: "", description: "", date: ""
  });

  const categories = form.type === "income" ? INCOME_CATS : EXPENSE_CATS;

  function handleAdd() {
    if (!form.amount || !form.date) {
      alert("Please fill in amount and date!");
      return;
    }
    setTransactions(prev => [{
      id:          Date.now(),
      type:        form.type,
      category:    form.category,
      amount:      parseFloat(form.amount),
      description: form.description,
      date:        form.date,
    }, ...prev]);
    setForm({ type: "expense", category: "Food", amount: "", description: "", date: "" });
    setShowForm(false);
  }

  function handleTypeToggle(t) {
    setForm(prev => ({ ...prev, type: t, category: t === "income" ? "Salary" : "Food" }));
  }

  return (
    <>
      {/* Floating + button */}
      <button className="fab" onClick={() => setShowForm(true)}>+</button>

      {/* Modal — only shown when showForm is true */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div className="modal-card">

            <div className="modal-header">
              <h3 className="modal-title">New Transaction</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>

            {/* Income / Expense toggle */}
            <div className="type-toggle">
              {["expense", "income"].map(t => (
                <button
                  key={t}
                  onClick={() => handleTypeToggle(t)}
                  className={`type-btn ${
                    form.type === t
                      ? t === "income" ? "type-btn-active-income" : "type-btn-active-expense"
                      : "type-btn-inactive"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <label className="modal-label">Amount (Rs.)</label>
            <input
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
              className="modal-input"
            />

            <label className="modal-label">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
              className="modal-input"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <label className="modal-label">Description (optional)</label>
            <input
              type="text"
              placeholder="What was this for?"
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="modal-input"
            />

            <label className="modal-label">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              className="modal-input"
              style={{ marginBottom: "1rem" }}
            />

            <button
              onClick={handleAdd}
              className={`modal-submit ${
                form.type === "income" ? "modal-submit-income" : "modal-submit-expense"
              }`}
            >
              Add {form.type === "income" ? "Income ↑" : "Expense ↓"}
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default AddButton;