import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ThankYou from './pages/ThankYou'
import Admin from './pages/Admin'
import Login from './pages/Login'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:4000/api'

export default function App(){
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    // restore cart from localStorage
    const raw = localStorage.getItem('cart')
    if (raw) setCart(JSON.parse(raw))
  }, [])

  useEffect(()=> localStorage.setItem('cart', JSON.stringify(cart)), [cart])

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(p => p.id === item.id)
      if (ex) return prev.map(p => p.id === item.id ? {...p, qty: p.qty + 1} : p)
      return [...prev, {...item, qty: 1}]
    })
  }

  const updateQty = (id, qty) => setCart(prev => prev.map(p => p.id === id ? {...p, qty} : p))
  const clearCart = () => { setCart([]); localStorage.removeItem('cart') }

  return (
    <div>
      <header className="topbar">
        <div className="brand"><Link to="/">Aniicone's Café</Link></div>
        <nav>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">Cart ({cart.reduce((s,i)=>s+i.qty,0)})</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/menu" element={<Menu addToCart={addToCart}/>} />
          <Route path="/cart" element={<Cart cart={cart} updateQty={updateQty} clearCart={clearCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="footer">&copy; Aniicone's Café</footer>
    </div>
  )
}
