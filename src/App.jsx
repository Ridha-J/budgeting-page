import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';
import './styles.css';
import Home         from "../pages/Home";
import Navbar       from "../components/Navbar";
import Budget       from "../pages/Budget";
import Transactions from "../pages/Transactions";
import Tracker      from "../components/Tracker";
import AddButton    from "../components/AddButton";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("budget_transactions");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, type: "income",  category: "Salary",    amount: 5000, description: "Monthly salary", date: "2026-05-01" },
          { id: 2, type: "expense", category: "Food",      amount: 320,  description: "Groceries",       date: "2026-05-05" },
          { id: 3, type: "income",  category: "Freelance", amount: 800,  description: "Design project",  date: "2026-05-10" },
          { id: 4, type: "expense", category: "Transport", amount: 90,   description: "Monthly pass",    date: "2026-05-03" },
        ];
  });

  useEffect(() => {
    localStorage.setItem("budget_transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <BrowserRouter>
      <Navbar />
      <Tracker transactions={transactions} />

      <Routes>
        <Route path='/'             element={<Home         transactions={transactions} />} />
        <Route path='/Transactions' element={<Transactions transactions={transactions} setTransactions={setTransactions} />} />
        <Route path='/Budget'       element={<Budget       transactions={transactions} />} />
      </Routes>

      {/* Floating + button — lives here so it shows on every page */}
      <AddButton setTransactions={setTransactions} />
    </BrowserRouter>
  );
}

export default App;