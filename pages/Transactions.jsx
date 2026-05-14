import '/src/styles.css';
import { useState } from "react";

// TransactionRow is a simple display component — no state needed here
function TransactionRow({ item, onDelete }) {
  const isIncome = item.type === "income";
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 1.25rem",
      borderBottom: "0.5px solid #2a0a40",
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "white" }}>
          {item.description || item.category}
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>
          {item.category} · {item.date}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* FIX: was "$", changed to "Rs." */}
        <span style={{ fontWeight: 600, color: isIncome ? "#0d9488" : "#e11d48" }}>
          {isIncome ? "+" : "-"}Rs.{item.amount}
        </span>
        {/* onDelete is called with this item's id when × is clicked */}
        <button
          onClick={() => onDelete(item.id)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9ca3af" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// FIX: added { transactions, setTransactions } props — were missing before
function Transactions({ transactions, setTransactions }) {
  function handleDelete(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: 28, marginBottom: "1.5rem" }}>Transactions</h1>

      <div className="transaction-list" style={{ maxWidth: 660, margin: "0 auto" }}>
        <h2 style={{ 
            padding: "12px 1.25rem", borderBottom: "0.5px solid #2a0a40", 
            fontSize: 14, fontWeight: 600, color: "white" }}>
          All Transactions ({transactions.length})
        </h2>

        {transactions.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
            No transactions yet. Use the + button to add one!
          </div>
        ) : (
          // .map() loops over transactions and renders a TransactionRow for each one
          // Each child in a list needs a unique "key" prop — React uses it internally
          transactions.map(item => (
            <TransactionRow
              key={item.id}
              item={item}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Transactions;