const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { nanoid } = require('nanoid');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// place order
router.post('/', async (req, res) => {
  const { items, customer } = req.body; // items: [{id, qty}]
  await db.read();
  const menu = db.data.menu;
  const lineItems = items.map(i => {
    const m = menu.find(x => x.id === i.id);
    return { id: i.id, name: m?.name || 'Unknown', price: m?.price || 0, qty: i.qty };
  });
  const subtotal = lineItems.reduce((s, it) => s + it.price * it.qty, 0);
  const taxRate = 0.07;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const order = {
    id: nanoid(8),
    timestamp: new Date().toISOString(),
    items: lineItems,
    customer: customer || (req.user ? { name: req.user.name, email: req.user.email } : { name: 'Guest', phone: '' }),
    subtotal,
    tax,
    total,
    status: 'Pending'
  };
  db.data.orders.push(order);
  await db.write();
  // emit new order to admin sockets only
  if (req.io) req.io.to('admins').emit('order:new', order);
  res.json(order);
});

// list orders with optional filters
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  await db.read();
  const { status, q } = req.query;
  let orders = db.data.orders || [];
  if (status) orders = orders.filter(o => o.status === status);
  if (q) {
    const qq = q.toLowerCase();
    orders = orders.filter(o => o.customer?.name?.toLowerCase().includes(qq) || o.items.some(it => it.name.toLowerCase().includes(qq)));
  }
  res.json(orders.reverse());
});

// update status
router.post('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  await db.read();
  const o = db.data.orders.find(x => x.id === id);
  if (!o) return res.status(404).json({ message: 'Order not found' });
  o.status = status;
  await db.write();
  if (req.io) req.io.to('admins').emit('order:update', o);
  res.json(o);
});

module.exports = router;
