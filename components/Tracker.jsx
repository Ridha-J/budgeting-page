import '../src/styles.css';

function SummaryCard({ label, amount, color }) {
  return (
    <div className="summary-card" style={{ borderTopColor: color }}>
      <div className="summary-card-label">
        {label}
      </div>
      <div className="summary-card-amount" style={{ color: color }}>
        Rs.{amount.toLocaleString()}
      </div>
    </div>
  );
}

function Tracker({ transactions }) {
  const totalIncome  = transactions
        .filter(t => t.type === "income")
        .reduce((total, t)  => total + t.amount, 0);
  const totalExpense = transactions
        .filter(t => t.type === "expense")
        .reduce((total, t) => total + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="tracker-style">
      <SummaryCard label="Total Income"   amount={totalIncome}  color="#0d9488" />
      <SummaryCard label="Total Expenses" amount={totalExpense} color="#e11d48" />
      <SummaryCard label="Net Balance"    amount={balance}      color={balance >= 0 ? "#6366f1" : "#e11d48"} />
    </div>
  );
}

export default Tracker;