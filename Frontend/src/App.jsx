import { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ category: 'All', sort: 'date_desc' });
  const [loading, setLoading] = useState(false);

  // 1. Fetch Data
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://expense-tracker-gyee.onrender.com?category=${filters.category}&sort=${filters.sort}`
      );
      setExpenses(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch when filters change
  useEffect(() => { fetchExpenses(); }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header & Total */}
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-2xl font-bold">My Expenses</h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-3xl font-bold text-blue-600">₹{total}</p>
          </div>
        </div>

        {/* Input Form */}
        <ExpenseForm refreshExpenses={fetchExpenses} />

        {/* Filters */}
        <div className="flex gap-2 mb-4 justify-end">
          <select 
            className="border p-2 rounded bg-white"
            value={filters.category} 
            onChange={e => setFilters({...filters, category: e.target.value})}
          >
            <option value="All">All Categories</option>
            {['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select 
            className="border p-2 rounded bg-white"
            value={filters.sort} 
            onChange={e => setFilters({...filters, sort: e.target.value})}
          >
            <option value="date_desc">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* List */}
        <ExpenseList expenses={expenses} loading={loading} />
        
      </div>
    </div>
  );
}

export default App;