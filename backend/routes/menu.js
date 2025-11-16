const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data.menu || []);
});

// admin route to update menu price/item (very simple, no auth middleware for demo)
router.post('/update', async (req, res) => {
  const { id, price, name, category } = req.body;
  await db.read();
  const idx = db.data.menu.findIndex(m => m.id === id);
  if (idx === -1) {
    const newItem = { id: id || `m${Date.now()}`, name, category, price };
    db.data.menu.push(newItem);
    await db.write();
    return res.json(newItem);
  }
  if (price !== undefined) db.data.menu[idx].price = price;
  if (name) db.data.menu[idx].name = name;
  if (category) db.data.menu[idx].category = category;
  await db.write();
  res.json(db.data.menu[idx]);
});

module.exports = router;
