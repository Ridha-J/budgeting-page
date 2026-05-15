import '../src/styles.css';
import { useState, useEffect } from "react";

const EXPENSE_CATS   = ["Food", "Transport", "Entertainment", "Shopping", "Other Expense"];
const DEFAULT_GOALS  = { Food: 500, Transport: 200, Entertainment: 300, Shopping: 400, "Other Expense": 200 };

function LimitItem({ category, spent, limit }) {
  const pct      = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOver   = spent > limit;
  const barColor = pct > 90 ? "#e11d48" : pct > 70 ? "#f59e0b" : "#0d9488";

  return (
    <div className="limit-item">
      <div className="limit-row">
        <span>{category}</span>
        <span className={isOver ? "limit-over" : "limit-ok"}>
          Rs.{spent} / Rs.{limit} {isOver && "⚠️ over"}
        </span>
      </div>
      <div className="progress-track">
        {/* width and background must stay inline — both are calculated values */}
        <div className="progress-bar" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}

function Budget({ transactions }) {
  const [activeTab, setActiveTab] = useState("view");

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("budget_goals");
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  const [draftGoals, setDraftGoals] = useState({ ...goals });

  useEffect(() => {
    localStorage.setItem("budget_goals", JSON.stringify(goals));
  }, [goals]);

  // Spending per category for this month only
  const thisMonth = new Date().getMonth();
  const thisYear  = new Date().getFullYear();

  const catSpend = {};
  transactions
    .filter(t => {
      const d = new Date(t.date);
      return t.type === "expense" && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .forEach(t => {
      catSpend[t.category] = (catSpend[t.category] || 0) + t.amount;
    });

  function saveGoals() {
    setGoals({ ...draftGoals });
    setActiveTab("view");
  }

  return (
    <div className="page">
      <h1 className="page-title">Budget Limits</h1>

      {/* Tab bar */}
      <div className="tab-bar">
        {["view", "edit"].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setDraftGoals({ ...goals }); }}
            className={`tab-btn ${activeTab === tab ? "tab-btn-active" : "tab-btn-inactive"}`}
          >
            {tab === "view" ? "📊 View Limits" : "✏️ Edit Limits"}
          </button>
        ))}
      </div>

      {/* Tab 1: View */}
      {activeTab === "view" && (
        <div className="budget-card">
          <p className="budget-card-note">Spending this month vs your set limits</p>
          {EXPENSE_CATS.map(cat => (
            <LimitItem
              key={cat}
              category={cat}
              spent={catSpend[cat] || 0}
              limit={goals[cat]    || 0}
            />
          ))}
        </div>
      )}

      {/* Tab 2: Edit */}
      {activeTab === "edit" && (
        <div className="budget-card">
          <p className="budget-card-note">Set a monthly spending limit for each category</p>
          {EXPENSE_CATS.map(cat => (
            <div key={cat} className="edit-field">
              <label className="edit-label">{cat}</label>
              <input
                type="number"
                value={draftGoals[cat] || ""}
                onChange={e => setDraftGoals(prev => ({ ...prev, [cat]: parseFloat(e.target.value) || 0 }))}
                className="edit-input"
              />
            </div>
          ))}
          <button onClick={saveGoals} className="save-btn">Save Limits</button>
        </div>
      )}
    </div>
  );
}

export default Budget;