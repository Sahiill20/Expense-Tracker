import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const ExpenseForm = ({ refreshExpenses }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  
  // NEW: State for errors
  const [errors, setErrors] = useState({});
  
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIdempotencyKey(uuidv4());
  }, []);

  // NEW: Validation Logic
  const validateForm = () => {
    const newErrors = {};
    
    // 1. Validate Description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    // 2. Validate Amount
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (Number(formData.amount) < 0) {
      newErrors.amount = 'Amount must be greater than 0 or 0';
    }

    // 3. Validate Date
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // NEW: Run validation before API call
    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post('https://expense-tracker-gyee.onrender.com', {
        ...formData,
        idempotencyKey
      });

      setFormData({ 
        description: '', amount: '', category: 'Food', 
        date: new Date().toISOString().split('T')[0] 
      });
      setErrors({}); // Clear errors
      setIdempotencyKey(uuidv4());
      refreshExpenses();

    } catch (error) {
      // Use the backend error message if available
      const serverError = error.response?.data?.error || 'Error saving expense.';
      alert(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 border rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Add Transaction</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        {/* Description Field */}
        <div>
          <input 
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
            placeholder="Description" 
            value={formData.description}
            onChange={e => {
              setFormData({...formData, description: e.target.value});
              if(errors.description) setErrors({...errors, description: ''}); // Clear error on type
            }} 
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Amount Field */}
        <div>
          <input 
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${errors.amount ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
            type="number" 
            placeholder="Amount (₹)" 
            step="0.01"
            value={formData.amount}
            onChange={e => {
              setFormData({...formData, amount: e.target.value});
              if(errors.amount) setErrors({...errors, amount: ''});
            }} 
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        </div>

        {/* Category Field */}
        <div>
          <select 
            className="w-full border p-2 rounded border-gray-300 bg-white"
            value={formData.category} 
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            {['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Date Field */}
        <div>
          <input 
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${errors.date ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
            type="date" 
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})} 
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>
      </div>

      <button 
        disabled={loading}
        className={`w-full py-2 rounded font-medium text-white transition-colors
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Saving...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;