const Expense = require('../models/expense');

exports.getExpenses = async (req, res) => {
  try {
    const { category, sort } = req.query;

    // 1. Build the Filter
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    // 2. Build the Sort
    let sortOptions = { date: -1 }; // Default: Newest first
    if (sort === 'oldest') {
      sortOptions = { date: 1 };
    }

    const expenses = await Expense.find(query).sort(sortOptions);

    // 3. Transform Data (Paisa -> Rupee) for the Frontend
    const formattedExpenses = expenses.map(exp => ({
      ...exp._doc,
      amount: (exp.amount / 100).toFixed(2) // Convert 15050 -> "150.50"
    }));

    // 4. Calculate Total (in Rupees)
    // We sum the Paisa first to avoid floating point errors, THEN convert.
    const totalPaisa = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRupee = (totalPaisa / 100).toFixed(2);

    res.status(200).json({
      count: expenses.length,
      total: totalRupee,
      data: formattedExpenses
    });

  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Add new expense
// @route   POST /api/expenses
exports.addExpense = async (req, res) => {
  try {
    const { description, amount, category, date, idempotencyKey } = req.body;

    // Validation
    if (!description || !amount || !category || !date || !idempotencyKey) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Convert Rupee to Paisa (150.50 -> 15050)
    // using Math.round ensures we don't get 15049.99999
    const amountInPaisa = Math.round(parseFloat(amount) * 100);

    const expense = await Expense.create({
      description,
      amount: amountInPaisa,
      category,
      date,
      idempotencyKey
    });

    res.status(201).json({
      success: true,
      data: {
        ...expense.toObject(),
        amount: (expense.amount / 100).toFixed(2) // Send back Rupee format
      }
    });

  } catch (error) {
    // IDEMPOTENCY CHECK
    // Error 11000 = Duplicate Key Error (MongoDB)
    const existing = await Expense.findOne({ idempotencyKey });
    if (error.code === 11000) {
      return res.status(200).json({ 
        success: true, 
        message: 'Expense already recorded',
        data: {
        ...existing.toObject(),
        amount: (existing.amount / 100).toFixed(2)
    }
      });
    }
    
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};