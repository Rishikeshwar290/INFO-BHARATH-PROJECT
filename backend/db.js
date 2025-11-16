const { Low, JSONFile } = require('lowdb');
const path = require('path');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

const file = path.join(__dirname, 'data', 'db.json');
const db = new Low(new JSONFile(file));

async function init() {
  await db.read();
  db.data = db.data || { users: [], menu: [], orders: [] };
  // seed menu if empty
  if (!db.data.menu || db.data.menu.length === 0) {
    db.data.menu = [
      // Drinks
      { id: 'drink1', category: 'Drinks', name: 'Cold Coffee', price: 5.0, image: 'https://via.placeholder.com/300x120?text=Cold+Coffee' },
      { id: 'drink2', category: 'Drinks', name: 'Cold Coffee With Ice Cream', price: 7.0, image: 'https://via.placeholder.com/300x120?text=Cold+Coffee+Ice+Cream' },
      { id: 'drink3', category: 'Drinks', name: 'Hot Coffee', price: 3.0, image: 'https://via.placeholder.com/300x120?text=Hot+Coffee' },
      { id: 'drink4', category: 'Drinks', name: 'Masala Chai', price: 4.0, image: 'https://via.placeholder.com/300x120?text=Masala+Chai' },
      // Burgers
      { id: 'burger1', category: 'Burgers', name: 'Regular Burger', price: 5.0, image: 'https://via.placeholder.com/300x120?text=Regular+Burger' },
      { id: 'burger2', category: 'Burgers', name: 'Cheese Burger', price: 7.0, image: 'https://via.placeholder.com/300x120?text=Cheese+Burger' },
      { id: 'burger3', category: 'Burgers', name: 'Cheese Paneer Loded', price: 9.0, image: 'https://via.placeholder.com/300x120?text=Paneer+Loaded' },
      { id: 'burger4', category: 'Burgers', name: 'Regular Burger (alu Tikki)', price: 7.0, image: 'https://via.placeholder.com/300x120?text=Alu+Tikki+Burger' },
      { id: 'burger5', category: 'Burgers', name: 'Cheese Burger (alu Tikki)', price: 9.0, image: 'https://via.placeholder.com/300x120?text=Cheese+Alu+Tikki' },
      { id: 'burger6', category: 'Burgers', name: 'Cheese Paneer Loded (alu Tikki)', price: 11.0, image: 'https://via.placeholder.com/300x120?text=Paneer+Alu+Tikki' },
      // Pizza
      { id: 'pizza1', category: 'Cone Pizza', name: 'Regular Pizza', price: 12.0, image: 'https://via.placeholder.com/300x120?text=Regular+Pizza' },
      { id: 'pizza2', category: 'Cone Pizza', name: 'Corn Pizza', price: 15.0, image: 'https://via.placeholder.com/300x120?text=Corn+Pizza' },
      { id: 'pizza3', category: 'Cone Pizza', name: 'Paneer Pizza', price: 15.0, image: 'https://via.placeholder.com/300x120?text=Paneer+Pizza' },
      { id: 'pizza4', category: 'Cone Pizza', name: 'Corn Paneer Pizza', price: 17.0, image: 'https://via.placeholder.com/300x120?text=Corn+Paneer+Pizza' },
      { id: 'pizza5', category: 'Cone Pizza', name: 'Extra Cheese', price: 2.0, image: 'https://via.placeholder.com/300x120?text=Extra+Cheese' }
    ];
  }

  // seed a default admin user for convenience if users empty
  if (!db.data.users || db.data.users.length === 0) {
    const pwd = 'admin123';
    const hash = await bcrypt.hash(pwd, 10);
    db.data.users = [
      { id: nanoid(8), name: 'Admin', email: 'admin@aniicone.local', password: hash, isAdmin: true }
    ];
    console.log('Seeded default admin: admin@aniicone.local / admin123');
  }

  await db.write();
}

module.exports = { db, init };