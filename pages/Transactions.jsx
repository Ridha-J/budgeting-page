import '/src/styles.css';

function TransactionRow({ item, onDelete }) {
  const isIncome = item.type === "income";
  return (
    <div className="txn-row">
      <div>
        <div className="txn-title">{item.description || item.category}</div>
        <div className="txn-meta">{item.category} · {item.date}</div>
      </div>
      <div className="txn-right">
        {/* color stays inline — it's a dynamic value based on type */}
        <span className="txn-amount" style={{ color: isIncome ? "#0d9488" : "#e11d48" }}>
          {isIncome ? "+" : "-"}Rs.{item.amount}
        </span>
        <button className="txn-delete" onClick={() => onDelete(item.id)}>×</button>
      </div>
    </div>
  );
}

function Transactions({ transactions, setTransactions }) {
  function handleDelete(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="page">
      <h1 className="page-title">Transactions</h1>

      <div className="transaction-list">
        <div className="txn-header">
          All Transactions ({transactions.length})
        </div>

        {transactions.length === 0 ? (
          <div className="txn-empty">No transactions yet. Use the + button to add one!</div>
        ) : (
            // .map() loops over transactions and renders a TransactionRow for each one
            // Each child in a list needs a unique "key" prop — React uses it internally
            transactions.map(item => (
                <TransactionRow key={item.id} item={item} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}

export default Transactions;