const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const { nanoid } = require('nanoid'); 
const { db } = require('../db');

// Must match the secret used everywhere else
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_aniicone'; 
const JWT_EXPIRES_IN = '1d'; 

// Helper: Generates a JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// =========================================================
// POST /api/auth/login 
// Fixes the "Wrong Credentials" login issue
// =========================================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  await db.read();
  const user = db.data.users.find(u => u.email === email);

  // 1. Check if user exists
  if (!user) {
    return res.status(401).json({ message: 'Wrong credentials' }); 
  }

  // 2. Compare the plain-text password with the stored hash
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Wrong credentials' }); 
  }

  // Success: Generate and return JWT
  const token = generateToken(user);
  
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false 
    }
  });
});

// =========================================================
// POST /api/auth/register (Optional)
// =========================================================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  await db.read();
  if (db.data.users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'User already exists' });
  }
  
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  const newUser = {
    id: nanoid(8),
    name,
    email,
    password: hash,
    isAdmin: false 
  };
  
  db.data.users.push(newUser);
  await db.write();

  const token = generateToken(newUser);

  res.status(201).json({ 
    token, 
    user: { id: newUser.id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin } 
  });
});

module.exports = router;