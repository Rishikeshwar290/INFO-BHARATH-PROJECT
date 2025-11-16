const jwt = require('jsonwebtoken');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_aniicone';

async function requireAuth(req, res, next){
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ message: 'Missing auth' });
  const parts = h.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth' });
  const token = parts[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    await db.read();
    const user = db.data.users.find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin };
    next();
  }catch(err){
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireAdmin(req, res, next){
  if (!req.user) return res.status(401).json({ message: 'Missing user' });
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
  next();
}

module.exports = { requireAuth, requireAdmin };