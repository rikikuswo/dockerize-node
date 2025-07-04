const express = require('express');
const app = express();
const userRoutes = require('./routes/user-routes'); // Sesuaikan jika kamu ingin modularisasi route

require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes); // Prefix all user routes

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
