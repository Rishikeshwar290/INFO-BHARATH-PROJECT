import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="landing">
      <h1>Welcome to Aniicone's Café</h1>
      <p>Trendy. Modern. Delicious.</p>
      <div className="hero">
        <img src="/logo.jpg" alt="logo" style={{maxWidth:200}} />
        <div>
          <p>Try our signature coffee and fresh baked goods.</p>
          <Link to="/menu" className="btn">View Menu</Link>
        </div>
      </div>
    </div>
  )
}
