const express = require('express');
const router = express.Router();
const { connectMongoDB } = require('../config/db/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ POST Register User
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashesPassword = await bcrypt.hash(password, 10);
    const db = await connectMongoDB();
    const result = await db.collection('users').insertOne({
      username,
      password: hashesPassword,
      createdAt: new Date()
    });
    res.status(201).json(result.ops?.[0] || { _id: result.insertedId, username, message: 'User registered successfully' });
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await connectMongoDB();
    const user = await db.collection('users').findOne({ username });

    if (!user) return res.status(404).json({ message: 'Authentication Failed' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Authentication Failed' });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || '12345',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;