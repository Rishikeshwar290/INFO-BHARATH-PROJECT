import React from 'react'
import { Link } from 'react-router-dom'

export default function ThankYou(){
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        color: 'white',
        padding: '40px 30px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ 
          fontSize: '3em', 
          margin: '0 0 15px 0',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Thank You!
        </h1>
        <p style={{ 
          fontSize: '1.2em', 
          margin: '0',
          opacity: 0.95
        }}>
          Your order has been placed successfully
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '8px', 
        maxWidth: '500px',
        margin: '0 auto',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: '#333', marginBottom: '20px' }}>
          We've sent your receipt to your email. Your order will be ready soon!
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/menu" className="btn">
            Order More
          </Link>
          <Link to="/" className="btn ghost">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

