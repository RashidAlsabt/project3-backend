const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const verifyToken = require("./middleware/verify-token")
const authRoutes = require("./controllers/auth.routes")
const transactionRoutes = require("./controllers/transaction.routes")
const categoryRoutes = require("./controllers/category.routes")
const paymentRoutes = require("./controllers/payment.routes")

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use("/auth",authRoutes)

app.use("/transaction", verifyToken, transactionRoutes)
app.use("/category", verifyToken, categoryRoutes)
app.use("/payment", verifyToken, paymentRoutes)

app.listen(3000, () => {
  console.log('The express app is ready!');
});
