const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-routes');

const verifyToken = require('./config/middleware/authMiddleware'); // Import the token verification middleware
const userRoutes = require('./routes/user-routes');

require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Express MongoDB API!');
});
app.use('/users', verifyToken, userRoutes); // Prefix all user routes
app.use('/auth', authRoutes); // Auth routes

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
