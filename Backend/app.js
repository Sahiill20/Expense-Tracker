require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes')

const app = express();

app.use(cors({
  origin: 'https://expense-tracker-gyee.onrender.com',
  credentials: true
}));
app.use(express.json());

app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Connection error:", err);
  }
}
startServer();