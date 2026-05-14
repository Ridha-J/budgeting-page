import '../src/styles.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const today  = new Date();

// Custom tooltip that shows on hover over a bar
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c0430", border: "0.5px solid #2a0a40", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
      <div style={{ fontWeight: 600, color: "white", marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.name === "Income" ? "#0d9488" : "#e11d48" }}>
          {p.name}: Rs.{p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

// Home receives transactions as a prop from App.jsx
function Home({ transactions }) {

  // Build chart data for the last 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    let m = today.getMonth() - 5 + i;
    let y = today.getFullYear();
    // Handle months going below 0 (e.g. Jan - 1 = Dec last year)
    while (m < 0) { m += 12; y--; }

    const monthTxns = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === m && d.getFullYear() === y;
    });

    return {
      month: MONTHS[m],
      Income:   monthTxns.filter(t => t.type === "income").reduce((s, t)  => s + t.amount, 0),
      Expenses: monthTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  return (
    <div className="page">
      <h1 style={{ fontSize: 28, marginBottom: "1.5rem" }}>Overview</h1>

      {/* Bar chart card */}
      <div style={{
        background: "#1c0430", border: "0.5px solid #2a0a40",
        borderRadius: 12, padding: "1.5rem", maxWidth: 700, margin: "0 auto"
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: "0.5rem", textAlign: "left" }}>
          Income vs Expenses — Last 6 months
        </h2>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 13, color: "#9ca3af" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "#0d9488", display: "inline-block" }}></span>
            Income
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "#e11d48", display: "inline-block" }}></span>
            Expenses
          </span>
        </div>

        {/* ResponsiveContainer makes the chart fill its parent width */}
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