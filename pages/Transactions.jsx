import '../src/styles.css'

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



function Transactions({ transactions, setTransactions }){
    function handleDelete(id) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }


    return(
        <>
        <div className='transaction-list'>
        <h1>
          Transactions ({transactions.length})
        </h1>

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
              onDelete={handleDelete} 
            />
          ))
        )}
      </div>
        </>
    )
}

export default Transactions;