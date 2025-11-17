import React, { useState } from 'react'
import api, { setAuthToken } from '../api'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'

export default function Checkout({ cart, clearCart }){
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0)
  const taxRate = 0.07
  const tax = Math.round(subtotal * taxRate * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  const placeOrder = async () => {
    // Input validation
    if (!cart.length) {
      alert('Your cart is empty');
      return;
    }
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Get token if exists
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
      }

      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          qty: item.qty
        })),
        customer: {
          name: name.trim(),
          phone: phone.trim()
        }
      };

      console.log('Sending order:', orderData);

      // Make the API call
      const response = await api.post('/orders', orderData);
      console.log('Order successful:', response.data);

      // Generate PDF receipt
      generatePdf(response.data);
      
      // Clear cart and redirect
      clearCart();
      navigate('/thank-you'); // Consider creating a thank you page
    } catch (error) {
      console.error('Order error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        // Server responded with error status
        alert(`Error: ${error.response.data?.message || 'Failed to place order'}`);
      } else if (error.request) {
        // No response received
        alert('No response from server. Please check your connection.');
      } else {
        // Request setup error
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const generatePdf = (order) => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Aniicone's Café", 14, 20)
    doc.setFontSize(11)
    doc.text(`Order ID: ${order.id}`, 14, 30)
    doc.text(`Date: ${new Date(order.timestamp).toLocaleString()}`, 14, 36)
    doc.text(`Customer: ${order.customer?.name || ''}`, 14, 42)
    let y = 52
    doc.text('Items:', 14, y)
    y += 6
    order.items.forEach(it => {
      doc.text(`${it.qty} x ${it.name}  @ ₹${it.price.toFixed(0)}  = ₹${(it.qty*it.price).toFixed(0)}`, 14, y)
      y += 6
    })
    y += 4
    doc.text(`Subtotal: ₹${order.subtotal.toFixed(0)}`, 14, y); y += 6
    doc.text(`Tax: ₹${order.tax.toFixed(0)}`, 14, y); y += 6
    doc.setFontSize(13)
    doc.text(`Total: ₹${order.total.toFixed(0)}`, 14, y)
    doc.save(`order-${order.id}.pdf`)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Checkout</h2>
      <div style={{marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>Full Name *</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Enter your full name"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            required
          />
        </div>
        <div style={{marginBottom: '25px'}}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>Phone Number *</label>
          <input 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="Enter your phone number"
            type="tel"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            required
          />
        </div>

        <div style={{margin: '25px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px'}}>
          <h3 style={{marginTop: 0, marginBottom: '15px', color: '#333'}}>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span>{item.qty} × {item.name}</span>
              <span>₹{(item.price * item.qty).toFixed(0)}</span>
            </div>
          ))}
          <div style={{borderTop: '1px solid #ddd', margin: '15px 0', paddingTop: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
              <span>Tax (7%):</span>
              <span>₹{tax.toFixed(0)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', marginTop: '10px'}}>
              <span>Total:</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={placeOrder} 
          disabled={loading || !name.trim() || !phone.trim()}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#ff0000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Processing...' : 'Place Order & Download Receipt'}
        </button>
      </div>
    </div>
  )
}