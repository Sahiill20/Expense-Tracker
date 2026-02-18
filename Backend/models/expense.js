const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true 
},
  amount: { 
    type: Number, 
    required: true,
    min: 0,
},
  date: { 
    type: Date, 
    required: true,
    index: true
},
  category: { 
    type: String, 
    required: true, 
    enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'] 
},
  
  idempotencyKey: { 
    type: String, 
    unique: true, 
    required: true 
} 
},
{ 
  timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);