import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const EXPENSE_CATS = ["Housing","Food","Transport","Healthcare","Entertainment","Shopping","Utilities","Education","Gift","Other"];
const INCOME_CATS = ["Salary","Freelance","Investment","Gift","Other Income"];

const CAT_ICONS = {
  Housing:"🏠", Food:"🍔", Transport:"🚗", Healthcare:"💊", Entertainment:"🎬",
  Shopping:"🛍️", Utilities:"💡", Education:"📚", Gift:"🎁", Other:"📦",
  Salary:"💼", Freelance:"💻", Investment:"📈", Gift:"🎁", "Other Income":"💰"
};

const today = new Date();
const pad = n => String(n).padStart(2,"0");
const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

const SAMPLE = [
  {id:1,type:"income",category:"Salary",amount:5000,description:"Monthly salary",date:`${today.getFullYear()}-${pad(today.getMonth()+1)}-01`},
  {id:2,type:"expense",category:"Housing",amount:1400,description:"Rent",date:`${today.getFullYear()}-${pad(today.getMonth()+1)}-02`},
  {id:3,type:"expense",category:"Food",amount:340,description:"Groceries & dining",date:`${today.getFullYear()}-${pad(today.getMonth()+1)}-05`},
  {id:4,type:"income",category:"Freelance",amount:900,description:"Design project",date:`${today.getFullYear()}-${pad(today.getMonth()+1)}-10`},
  {id:5,type:"expense",category:"Transport",amount:90,description:"Monthly pass",date:`${today.getFullYear()}-${pad(today.getMonth()+1)}-03`},
  {id:6,type:"expense",category:"Entertainment",amount:60,description:"Streaming & events",date:`${today.getFullYear()}-${pad(today.getMonth()+1)}-12`},
  {id:7,type:"expense",category:"Utilities",amount:110,description:"Electricity & internet",date:`${today.getFullYear()}-${pad(today.getMonth()+1)}-08`},
];

const DEFAULT_GOALS = {Housing:1500,Food:600,Transport:200,Healthcare:200,Entertainment:150,Shopping:200,Utilities:150,Education:100,Other:100};

function fmt(n) { return "$" + n.toLocaleString("en-US", {minimumFractionDigits:0,maximumFractionDigits:0}); }

const colors = {
  income: "#0d9488",
  expense: "#e11d48",
  balance: "#6366f1",
  teal: "#14b8a6",
  rose: "#f43f5e",
  indigo: "#818cf8",
  bg: "var(--color-background-primary)",
  bgSecondary: "var(--color-background-secondary)",
  border: "var(--color-border-tertiary)",
  text: "var(--color-text-primary)",
  muted: "var(--color-text-secondary)",
};

function SummaryCard({ label, value, accent, icon, sub }) {
  return (
    <div style={{background:colors.bg, border:`0.5px solid ${colors.border}`, borderRadius:12, padding:"1rem 1.25rem", flex:1, minWidth:0, borderTop:`3px solid ${accent}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <span style={{fontSize:13,color:colors.muted,fontWeight:500}}>{label}</span>
        <span style={{fontSize:20}}>{icon}</span>
      </div>
      <div style={{fontSize:26,fontWeight:600,color:accent,marginTop:6,lineHeight:1}}>{value}</div>
      {sub && <div style={{fontSize:12,color:colors.muted,marginTop:4}}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ spent, limit, label, icon }) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const over = spent > limit;
  const barColor = pct > 90 ? colors.expense : pct > 70 ? "#f59e0b" : colors.income;
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <span style={{fontSize:13,color:colors.text,display:"flex",alignItems:"center",gap:5}}>
          <span>{icon}</span>{label}
        </span>
        <span style={{fontSize:12,color: over ? colors.expense : colors.muted, fontWeight: over ? 600 : 400}}>
          {fmt(spent)} / {fmt(limit)}
          {over && <span style={{marginLeft:4,color:colors.expense}}>⚠️ over</span>}
        </span>
      </div>
      <div style={{height:7,background:colors.bgSecondary,borderRadius:4,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:barColor,borderRadius:4,transition:"width 0.4s ease"}} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:colors.bg,border:`0.5px solid ${colors.border}`,borderRadius:8,padding:"10px 14px",fontSize:13}}>
      <div style={{fontWeight:600,marginBottom:6,color:colors.text}}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{display:"flex",justifyContent:"space-between",gap:16,color:p.name==="Income"?colors.income:colors.expense}}>
          <span>{p.name}</span><span style={{fontWeight:600}}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function BudgetTracker2() {
  const [transactions, setTransactions] = useState(SAMPLE);
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [showAdd, setShowAdd] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [form, setForm] = useState({ type:"expense", category:"Food", amount:"", description:"", date:fmtDate(today) });
  const [draftGoals, setDraftGoals] = useState({ ...DEFAULT_GOALS });
  const [activeTab, setActiveTab] = useState("overview");

  const monthTxns = useMemo(() => transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }), [transactions, month, year]);

  const totalIncome = useMemo(() => monthTxns.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0), [monthTxns]);
  const totalExpense = useMemo(() => monthTxns.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0), [monthTxns]);
  const balance = totalIncome - totalExpense;

  const catSpend = useMemo(() => {
    const m = {};
    monthTxns.filter(t => t.type === "expense").forEach(t => { m[t.category] = (m[t.category]||0)+t.amount; });
    return m;
  }, [monthTxns]);

  const chartData = useMemo(() => Array.from({length:6},(_,i) => {
    let m = today.getMonth() - 5 + i, y = today.getFullYear();
    while(m < 0){ m+=12; y--; }
    const txns = transactions.filter(t => { const d=new Date(t.date); return d.getMonth()===m && d.getFullYear()===y; });
    return {
      month: MONTHS[m],
      Income: txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),
      Expenses: txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),
    };
  }), [transactions]);

  const prevMonth = () => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };

  const addTxn = () => {
    if(!form.amount || isNaN(+form.amount) || +form.amount <= 0) return;
    setTransactions(prev => [{id:Date.now(),type:form.type,category:form.category,amount:parseFloat(form.amount),description:form.description,date:form.date},...prev]);
    setForm({type:"expense",category:"Food",amount:"",description:"",date:fmtDate(today)});
    setShowAdd(false);
  };

  const saveGoals = () => { setGoals({...draftGoals}); setShowGoals(false); };

  const inputStyle = { width:"100%", padding:"8px 12px", border:`0.5px solid ${colors.border}`, borderRadius:8, fontSize:14, background:colors.bgSecondary, color:colors.text, boxSizing:"border-box" };
  const labelStyle = { fontSize:12, color:colors.muted, marginBottom:4, display:"block" };

  return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:700,margin:"0 auto",padding:"1.5rem 0.75rem",color:colors.text}}>
      <h2 className="sr-only">Budget Tracker — income, expenses, and monthly goals</h2>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:600,margin:0,letterSpacing:"-0.5px"}}>Budget Tracker</h1>
          <p style={{fontSize:13,color:colors.muted,margin:"2px 0 0"}}>Track income, expenses & goals</p>
        </div>
        <button onClick={()=>{setShowAdd(true);setShowGoals(false);}} style={{background:colors.income,color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
          + Add Transaction
        </button>
      </div>

      {/* Month Nav */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:"1.25rem"}}>
        <button onClick={prevMonth} style={{background:"none",border:`0.5px solid ${colors.border}`,borderRadius:6,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:colors.text}}>‹</button>
        <span style={{fontSize:16,fontWeight:600,minWidth:130,textAlign:"center"}}>{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} style={{background:"none",border:`0.5px solid ${colors.border}`,borderRadius:6,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:colors.text}}>›</button>
      </div>

      {/* Summary Cards */}
      <div style={{display:"flex",gap:12,marginBottom:"1.5rem",flexWrap:"wrap"}}>
        <SummaryCard label="Total Income" value={fmt(totalIncome)} accent={colors.income} icon="📥" sub={`${monthTxns.filter(t=>t.type==="income").length} transactions`} />
        <SummaryCard label="Total Expenses" value={fmt(totalExpense)} accent={colors.expense} icon="📤" sub={`${monthTxns.filter(t=>t.type==="expense").length} transactions`} />
        <SummaryCard label="Net Balance" value={fmt(balance)} accent={balance>=0?colors.balance:colors.expense} icon={balance>=0?"✅":"⚠️"} sub={balance>=0?"On track":"Overspent"} />
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:"1.25rem",borderBottom:`0.5px solid ${colors.border}`,paddingBottom:0}}>
        {["overview","transactions","goals"].map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)} style={{
            background:"none", border:"none", borderBottom: activeTab===tab ? `2px solid ${colors.income}` : "2px solid transparent",
            padding:"8px 14px", fontSize:13, fontWeight: activeTab===tab ? 600 : 400,
            color: activeTab===tab ? colors.income : colors.muted, cursor:"pointer", textTransform:"capitalize", marginBottom:-1
          }}>{tab}</button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div>
          <div style={{background:colors.bg,border:`0.5px solid ${colors.border}`,borderRadius:12,padding:"1rem 1.25rem",marginBottom:"1.25rem"}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Income vs Expenses — Last 6 months</div>
            <div style={{display:"flex",gap:16,marginBottom:12,fontSize:12,color:colors.muted}}>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:2,background:colors.income,display:"inline-block"}}></span>Income</span>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:2,background:colors.expense,display:"inline-block"}}></span>Expenses</span>
            </div>
            <div style={{position:"relative",width:"100%",height:220}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" vertical={false} />
                  <XAxis dataKey="month" tick={{fontSize:12,fill:"#888"}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize:11,fill:"#888"}} axisLine={false} tickLine={false} tickFormatter={v=>"$"+v.toLocaleString()} width={55} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill:"rgba(128,128,128,0.06)"}} />
                  <Bar dataKey="Income" fill={colors.income} radius={[4,4,0,0]} />
                  <Bar dataKey="Expenses" fill={colors.expense} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending breakdown for current month */}
          <div style={{background:colors.bg,border:`0.5px solid ${colors.border}`,borderRadius:12,padding:"1rem 1.25rem"}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Spending by category — {MONTHS[month]}</div>
            {EXPENSE_CATS.filter(c => catSpend[c] > 0).length === 0
              ? <div style={{color:colors.muted,fontSize:13,textAlign:"center",padding:"1.5rem 0"}}>No expenses this month yet.</div>
              : EXPENSE_CATS.filter(c => catSpend[c] > 0).sort((a,b)=>(catSpend[b]||0)-(catSpend[a]||0)).map(cat => {
                  const spent = catSpend[cat]||0;
                  const pct = totalExpense > 0 ? (spent/totalExpense*100).toFixed(0) : 0;
                  return (
                    <div key={cat} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                      <span style={{fontSize:16,width:22}}>{CAT_ICONS[cat]}</span>
                      <span style={{fontSize:13,flex:1,color:colors.text}}>{cat}</span>
                      <span style={{fontSize:12,color:colors.muted,width:30,textAlign:"right"}}>{pct}%</span>
                      <div style={{width:80,height:6,background:colors.bgSecondary,borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:colors.expense,borderRadius:3}} />
                      </div>
                      <span style={{fontSize:13,fontWeight:600,color:colors.text,width:70,textAlign:"right"}}>{fmt(spent)}</span>
                    </div>
                  );
                })
            }
          </div>
        </div>
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === "transactions" && (
        <div style={{background:colors.bg,border:`0.5px solid ${colors.border}`,borderRadius:12,overflow:"hidden"}}>
          {monthTxns.length === 0
            ? <div style={{padding:"2rem",textAlign:"center",color:colors.muted,fontSize:14}}>No transactions for {MONTHS[month]} {year}.<br/>Click "Add Transaction" to get started.</div>
            : [...monthTxns].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((t,i) => (
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 1.25rem",borderBottom: i < monthTxns.length-1 ? `0.5px solid ${colors.border}` : "none"}}>
                <div style={{width:36,height:36,borderRadius:8,background:t.type==="income"?"rgba(13,148,136,0.1)":"rgba(225,29,72,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                  {CAT_ICONS[t.category]}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:500,color:colors.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.description || t.category}</div>
                  <div style={{fontSize:12,color:colors.muted,marginTop:1}}>{t.category} · {new Date(t.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                </div>
                <div style={{fontWeight:600,fontSize:15,color:t.type==="income"?colors.income:colors.expense,flexShrink:0}}>
                  {t.type==="income"?"+":"-"}{fmt(t.amount)}
                </div>
                <button onClick={()=>setTransactions(p=>p.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",cursor:"pointer",color:colors.muted,fontSize:16,padding:"4px",lineHeight:1}} title="Delete">×</button>
              </div>
            ))
          }
        </div>
      )}

      {/* GOALS TAB */}
      {activeTab === "goals" && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
            <div style={{fontSize:13,color:colors.muted}}>Budget limits for {MONTHS[month]}</div>
            <button onClick={()=>{setDraftGoals({...goals});setShowGoals(true);}} style={{background:"none",border:`0.5px solid ${colors.border}`,borderRadius:6,padding:"6px 12px",fontSize:12,cursor:"pointer",color:colors.text}}>✏️ Edit Limits</button>
          </div>
          <div style={{background:colors.bg,border:`0.5px solid ${colors.border}`,borderRadius:12,padding:"1rem 1.25rem"}}>
            {EXPENSE_CATS.map(cat => (
              <ProgressBar key={cat} label={cat} icon={CAT_ICONS[cat]} spent={catSpend[cat]||0} limit={goals[cat]||0} />
            ))}
            <div style={{borderTop:`0.5px solid ${colors.border}`,paddingTop:12,marginTop:4,display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:colors.muted,fontWeight:500}}>Total budget used</span>
              <span style={{fontWeight:600,color:totalExpense > Object.values(goals).reduce((a,b)=>a+b,0) ? colors.expense : colors.income}}>
                {fmt(totalExpense)} / {fmt(Object.values(goals).reduce((a,b)=>a+b,0))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ADD TRANSACTION MODAL */}
      {showAdd && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem"}}
          onClick={e=>{ if(e.target===e.currentTarget) setShowAdd(false); }}>
          <div style={{background:colors.bg,borderRadius:16,padding:"1.5rem",width:"100%",maxWidth:400,boxSizing:"border-box"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
              <h3 style={{margin:0,fontSize:16,fontWeight:600}}>New Transaction</h3>
              <button onClick={()=>setShowAdd(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:colors.muted,lineHeight:1}}>×</button>
            </div>

            {/* Type toggle */}
            <div style={{display:"flex",borderRadius:8,border:`0.5px solid ${colors.border}`,overflow:"hidden",marginBottom:"1rem"}}>
              {["expense","income"].map(t => (
                <button key={t} onClick={()=>setForm(f=>({...f,type:t,category:t==="income"?"Salary":"Food"}))}
                  style={{flex:1,padding:"8px",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                    background:form.type===t?(t==="income"?colors.income:colors.expense):colors.bgSecondary,
                    color:form.type===t?"#fff":colors.muted,textTransform:"capitalize",transition:"background 0.2s"}}>
                  {t}
                </button>
              ))}
            </div>

            <label style={labelStyle}>Amount</label>
            <input type="number" placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
              style={{...inputStyle,marginBottom:"0.75rem"}} />

            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{...inputStyle,marginBottom:"0.75rem"}}>
              {(form.type==="income"?INCOME_CATS:EXPENSE_CATS).map(c=><option key={c}>{c}</option>)}
            </select>

            <label style={labelStyle}>Description <span style={{color:colors.muted,fontWeight:400}}>(optional)</span></label>
            <input type="text" placeholder="What was this for?" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
              style={{...inputStyle,marginBottom:"0.75rem"}} />

            <label style={labelStyle}>Date</label>
            <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}
              style={{...inputStyle,marginBottom:"1.25rem"}} />

            <button onClick={addTxn} style={{width:"100%",padding:"10px",background:form.type==="income"?colors.income:colors.expense,color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>
              Add {form.type === "income" ? "Income" : "Expense"}
            </button>
          </div>
        </div>
      )}

      {/* EDIT GOALS MODAL */}
      {showGoals && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem"}}
          onClick={e=>{ if(e.target===e.currentTarget) setShowGoals(false); }}>
          <div style={{background:colors.bg,borderRadius:16,padding:"1.5rem",width:"100%",maxWidth:400,maxHeight:"80vh",overflowY:"auto",boxSizing:"border-box"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
              <h3 style={{margin:0,fontSize:16,fontWeight:600}}>Monthly Budget Limits</h3>
              <button onClick={()=>setShowGoals(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:colors.muted,lineHeight:1}}>×</button>
            </div>
            {EXPENSE_CATS.map(cat => (
              <div key={cat} style={{marginBottom:"0.75rem"}}>
                <label style={labelStyle}>{CAT_ICONS[cat]} {cat}</label>
                <input type="number" value={draftGoals[cat]||""} onChange={e=>setDraftGoals(g=>({...g,[cat]:parseFloat(e.target.value)||0}))}
                  style={inputStyle} />
              </div>
            ))}
            <button onClick={saveGoals} style={{width:"100%",padding:"10px",background:colors.income,color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",marginTop:"0.5rem"}}>
              Save Limits
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
