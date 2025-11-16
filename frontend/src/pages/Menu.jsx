import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:4000/api'

export default function Menu({ addToCart }){
  const [menu, setMenu] = useState([])
  const [error, setError] = useState(null)
  useEffect(()=>{
    console.log('Fetching menu from:', `${API}/menu`)
    axios.get(`${API}/menu`).then(r=> {
      console.log('Menu loaded:', r.data)
      setMenu(r.data)
    }).catch(e=> {
      console.error('Menu fetch error:', e)
      setError(e.message)
    })
  }, [])

  const grouped = menu.reduce((acc, it)=>{
    acc[it.category] = acc[it.category] || []
    acc[it.category].push(it)
    return acc
  }, {})

  return (
    <div>
      <h2>Menu</h2>
      <div style={{width:'100%', marginBottom:'30px', borderRadius:'8px', overflow:'hidden'}}>
        <img src="/menu-board.jpg" alt="Menu Board" style={{width:'100%', height:'auto', display:'block'}} />
      </div>
      {error && <p style={{color: 'red'}}>Error loading menu: {error}</p>}
      {!menu.length && !error && <p>Loading menu...</p>}
      {Object.keys(grouped).map(cat => (
        <section key={cat} className="menu-category">
          <h3>{cat}</h3>
          <div className="items">
            {grouped[cat].map(it => (
              <div key={it.id} className="menu-item">
                <div style={{width:'100%', aspectRatio:'16/9', background:'#f0f0f0', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                  {it.image ? (
                    <img src={it.image} alt={it.name} style={{width:'100%', height:'100%', objectFit:'contain'}} onError={(e)=>{e.target.style.display='none'}} />
                  ) : (
                    <div style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'14px', fontWeight:'bold', textAlign:'center', padding:'8px'}}>{it.name}</div>
                  )}
                </div>
                <div>
                  <strong>{it.name}</strong>
                  <div className="price">₹{it.price.toFixed(0)}</div>
                </div>
                <button onClick={()=>addToCart(it)}>Add</button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
