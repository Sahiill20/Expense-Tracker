require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes')

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://expense-tracker-pi-lac-73.vercel.app"
  ]
}));


app.use(express.json());

app.use('/', expenseRoutes);

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