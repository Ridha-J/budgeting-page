import '../src/styles.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const today  = new Date();

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) 
    return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.name === "Income" ? "#0d9488" : "#e11d48" }}>
          {p.name}: Rs.{p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

function Home({ transactions }) {
  const chartData = Array.from({ length: 6 }, (_, i) => {
    let m = today.getMonth() - 5 + i;
    let y = today.getFullYear();
    while (m < 0) { m += 12; y--; }

    const monthTxns = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === m && d.getFullYear() === y;
    });

    return {
      month:    MONTHS[m],
      Income:   monthTxns.filter(t => t.type === "income").reduce((s, t)  => s + t.amount, 0),
      Expenses: monthTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  return (
    <div className="page">
      <h1 className="page-title">Overview</h1>

      <div className="chart-card">
        <h2 className="chart-heading">Income vs Expenses — Last 6 months</h2>

        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot legend-dot-income"></span>Income
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-dot-expense"></span>Expenses
          </span>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barGap={4} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
              tickFormatter={v => "Rs." + v.toLocaleString()} width={70} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="Income"   fill="#0d9488" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#e11d48" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Home;