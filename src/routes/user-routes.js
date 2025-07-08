const express = require('express');
const router = express.Router();
const { connectMongoDB } = require('../config/db/db'); // sesuaikan path
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

// 📄 GET All Users
router.get('/', async (req, res) => {
  try {
    const db = await connectMongoDB();
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 📄 GET User by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await connectMongoDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Invalid ID or server error' });
  }
});

// ✅ POST Create User
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const db = await connectMongoDB();
    const result = await db.collection('users').insertOne({
      name,
      email,
      createdAt: new Date()
    });
    res.status(201).json(result.ops?.[0] || { _id: result.insertedId, name, email });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// ✏️ PUT Update User
router.put('/:id', async (req, res) => {
  try {
    const db = await connectMongoDB();
    const { name, email } = req.body;
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, email } },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ message: 'User not found' });
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// 🗑 DELETE User
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectMongoDB();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ✅ POST Register User
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashesPassword = await bcrypt.hash(password, 10);
    const db = await connectMongoDB();
    const result = await db.collection('users').insertOne({
      email,
      password: hashesPassword,
      createdAt: new Date()
    });
    res.status(201).json(result.ops?.[0] || { _id: result.insertedId, email, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;
