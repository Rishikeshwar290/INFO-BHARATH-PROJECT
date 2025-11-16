const express = require('express');
const cors = require('cors');
const { init, db } = require('./db');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const ordersRoutes = require('./routes/orders');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_aniicone';

app.use(cors());
app.use(express.json());

app.use((req, res, next) => { req.io = io; next(); });

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/', (req, res) => res.send('Aniicone\'s Café API running'));

init().then(() => {
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});

// Authenticate sockets for admin room membership
io.on('connection', async (socket) => {
  try{
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET);
      // attach user info if found in db
      await db.read();
      const user = db.data.users.find(u => u.id === payload.id);
      if (user && user.isAdmin) {
        socket.join('admins');
        socket.user = { id: user.id, name: user.name, isAdmin: true };
        console.log(`Admin socket connected: ${socket.id} (${user.email})`);
      } else {
        // non-admin or missing user
        console.log(`Socket connected (no admin): ${socket.id}`);
      }
    } else {
      console.log(`Socket connected (guest): ${socket.id}`);
    }
  }catch(err){
    console.log('Socket auth error', err.message || err);
  }
});
