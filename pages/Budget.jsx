import '../src/styles.css';
import { useState, useEffect } from "react";

const EXPENSE_CATS = ["Food", "Transport", "Entertainment", "Shopping", "Other Expense"];

const DEFAULT_GOALS = { Food: 500, Transport: 200, Entertainment: 300, Shopping: 400, "Other Expense": 200 };

// Shows one category row with a progress bar
function LimitItem({ category, spent, limit }) {
  const pct     = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOver  = spent > limit;
  const barColor = pct > 90 ? "#e11d48" : pct > 70 ? "#f59e0b" : "#0d9488";

  return (
    <div className="limit-item" style={{ flexDirection: "column", gap: 6, alignItems: "stretch" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "white" }}>
        <span>{category}</span>
        <span style={{ color: isOver ? "#e11d48" : "#9ca3af" }}>
          Rs.{spent} / Rs.{limit} {isOver && "⚠️ over"}
        </span>
      </div>
      {/* Progress bar */}
      <div style={{ height: 7, background: "#0d0019", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 4, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

// Budget receives transactions from App.jsx
function Budget({ transactions }) {

  const [activeTab, setActiveTab] = useState("view");  // "view" or "edit"

  // Load goals from localStorage, or use defaults
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("budget_goals");
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  // Draft goals only change while editing — saved when "Save" is clicked
  const [draftGoals, setDraftGoals] = useState({ ...goals });

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("budget_goals", JSON.stringify(goals));
  }, [goals]);

  // Calculate how much was spent per category this month
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
    setActiveTab("view");  // switch back to view tab after saving
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: 28, marginBottom: "1.5rem" }}>Budget Limits</h1>

      {/* ── Tab buttons ── */}
      <div style={{
        display: "flex", maxWidth: 600, margin: "0 auto 1.5rem",
        borderBottom: "0.5px solid #2a0a40",
      }}>
        {["view", "edit"].map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setDraftGoals({ ...goals }); }}
            style={{
              flex: 1, padding: "10px", border: "none", borderBottom: activeTab === tab ? "2px solid #0d9488" : "2px solid transparent",
              background: "none", color: activeTab === tab ? "#0d9488" : "#9ca3af",
              fontWeight: activeTab === tab ? 600 : 400, fontSize: 14,
              cursor: "pointer", textTransform: "capitalize", marginBottom: -1,
            }}>
            {tab === "view" ? "📊 View Limits" : "✏️ Edit Limits"}
          </button>
        ))}
      </div>

      {/* ── Tab 1: View — shows progress bars for each category ── */}
      {activeTab === "view" && (
        <div style={{
          background: "#1c0430", border: "0.5px solid #2a0a40",
          borderRadius: 12, padding: "1.25rem", maxWidth: 600, margin: "0 auto"
        }}>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "1rem", textAlign: "left" }}>
            Spending this month vs your set limits
          </p>
          {EXPENSE_CATS.map(cat => (
            <LimitItem
              key={cat}
              category={cat}
              spent={catSpend[cat] || 0}
              limit={goals[cat] || 0}
            />
          ))}
        </div>
      )}

      {/* ── Tab 2: Edit — inputs to change each limit ── */}
      {activeTab === "edit" && (
        <div style={{
          background: "#1c0430", border: "0.5px solid #2a0a40",
          borderRadius: 12, padding: "1.25rem", maxWidth: 600, margin: "0 auto"
        }}>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "1rem", textAlign: "left" }}>
            Set a monthly spending limit for each category
          </p>
          {EXPENSE_CATS.map(cat => (
            <div key={cat} style={{ marginBottom: "0.75rem" }}>
              <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 4 }}>{cat}</label>
              <input
                type="number"
                value={draftGoals[cat] || ""}
                onChange={e => setDraftGoals(prev => ({ ...prev, [cat]: parseFloat(e.target.value) || 0 }))}
                style={{
                  width: "100%", padding: "8px 12px",
                  border: "0.5px solid #2a0a40", borderRadius: 8,
                  fontSize: 14, background: "#0d0019",
                  color: "white", boxSizing: "border-box",
                }}
              />
            </div>
          ))}
          <button onClick={saveGoals}
            style={{
              width: "100%", marginTop: "0.5rem", padding: "10px",
              background: "#0d9488", color: "white",
              border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
            Save Limits
          </button>
        </div>
      )}
    </div>
  );
}

export default Budget;