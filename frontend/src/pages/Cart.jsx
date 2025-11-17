import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart({ cart, updateQty, clearCart }){
  const navigate = useNavigate()
  const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0)
  return (
    <div>
      <h2>Your Cart</h2>
      {!cart.length && <p>Cart is empty. <Link to="/menu">Browse menu</Link></p>}
      {cart.map(it=> (
        <div key={it.id} className="cart-item">
          <div>{it.name}</div>
          <div>
            <input type="number" min="1" value={it.qty} onChange={e=>updateQty(it.id, Number(e.target.value))} />
            x ₹{it.price.toFixed(0)}
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <div>Subtotal: ₹{subtotal.toFixed(0)}</div>
        <div>
          <button onClick={()=>navigate('/checkout')} className="btn">Checkout</button>
          <button onClick={clearCart} className="btn ghost">Clear</button>
        </div>
      </div>
    </div>
  )
}
