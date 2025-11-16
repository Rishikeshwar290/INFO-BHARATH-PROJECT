# Aniicone's Café — Fullstack Demo

This repository contains a minimal fullstack website for Aniicone's Café — a browser-based ordering and billing demo.

Features included:
- Landing page
- Dynamic menu fetched from backend
- Cart and checkout with order placement
- Admin dashboard to view and update orders (real-time via Socket.io)
- Invoice / PDF download using jsPDF
- Simple JWT-based auth endpoints (signup/login)

Tech stack:
- Backend: Node.js + Express + lowdb (file-based JSON DB) + Socket.io
- Frontend: React (Vite) + jsPDF + socket.io-client

Setup (Windows, cmd.exe):

1) Backend

```
cd "c:\Users\hp\Desktop\ANICONES CAFE\backend"
npm install
npm run dev
```

Server starts on port 4000 by default.

2) Frontend

Open a new terminal:

```
cd "c:\Users\hp\Desktop\ANICONES CAFE\frontend"
npm install
npm run dev
```

Frontend starts (Vite) and will use the backend API at `http://localhost:4000/api` by default.

Notes:
- This is a demo scaffold. lowdb stores data in `backend/data/db.json`.
- For production, replace lowdb with a proper DB (MongoDB/Postgres) and add robust auth and validation.
- Add a real logo image at `frontend/public/logo.png` to show brand visuals.

Admin & real-time notes:
- A default admin user is seeded on first run: `admin@aniicone.local` / `admin123`.
- Visit `/login` and sign in using the seeded admin credentials (or create an account). The JWT token is saved to `localStorage` and used automatically by the frontend `api` instance.
- The Admin dashboard authenticates the Socket.io connection by sending the JWT token during handshake; only authenticated admin sockets join the `admins` room and receive `order:new` / `order:update` events.

Security & next steps:
- This demo is not production-ready. Recommended next steps: add input validation, use a persistent DB, protect Socket.io more robustly, add HTTPS, and improve error handling.

If you'd like, I can:
- Wire socket auth deeper (refresh tokens, socket reauth)
- Migrate to MongoDB and add proper models
- Add UI polish and mobile-first testing
- Prepare a deployment guide
# Aniicone's Café — Fullstack Demo

This repository contains a minimal fullstack website for Aniicone's Café.

Features included:
- Landing page
- Dynamic menu fetched from backend
- Cart and checkout with order placement
- Admin dashboard to view and update orders (real-time via Socket.io)
- Invoice / PDF download using jsPDF
- Simple JWT-based auth endpoints (signup/login)

Tech stack:
- Backend: Node.js + Express + lowdb (file-based JSON DB) + Socket.io
- Frontend: React (Vite) + jsPDF + socket.io-client

Setup (Windows, cmd.exe):

1) Backend

```
cd "c:\Users\hp\Desktop\ANICONES CAFE\backend"
npm install
npm run dev
```

Server starts on port 4000 by default.

2) Frontend

Open a new terminal:

```
cd "c:\Users\hp\Desktop\ANICONES CAFE\frontend"
npm install
npm run dev
```

Frontend starts (Vite) and will use the backend API at `http://localhost:4000/api` by default.

Notes:
- This is a demo scaffold. lowdb stores data in `backend/data/db.json`.
- For production, replace lowdb with a proper DB (MongoDB/Postgres) and add robust auth and validation.
- Add a real logo image at `frontend/public/logo.png` to show brand visuals.

Next steps I can take for you:
- Add JWT-protected admin routes and middleware
- Add user signup/login UI
- Improve styling and mobile-first adjustments
- Integrate persistent DB like MongoDB and deploy

Tell me which of these you'd like me to implement next.
