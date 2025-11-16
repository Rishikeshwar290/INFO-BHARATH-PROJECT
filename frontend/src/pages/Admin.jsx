import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../api'

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [q, setQ] = useState('')
  const [socket, setSocket] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    checkAdminStatus()
    return () => {
      if (socket) socket.disconnect()
    }
  }, [])

  const checkAdminStatus = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoading(false)
      return
    }
    
    try {
      setAuthToken(token)
      const res = await api.get('/auth/me')
      if (res.data.isAdmin) {
        setIsAdmin(true)
        setupSocket(token)
        fetchOrders()
      }
    } catch (err) {
      console.error('Admin check failed:', err)
      localStorage.removeItem('token')
    } finally {
      setIsLoading(false)
    }
  }

  const setupSocket = (token) => {
    const s = io(import.meta.env.VITE_SOCKET || 'http://localhost:4000', { 
      auth: { token },
      reconnectionAttempts: 3,
      reconnectionDelay: 1000
    })
    
    s.on('connect', () => {
      console.log('Socket connected')
      setSocket(s)
    })

    s.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
    })

    s.on('order:new', (order) => {
      setOrders(prev => [order, ...prev])
    })

    s.on('order:update', (update) => {
      setOrders(prev => prev.map(o => o.id === update.id ? update : o))
    })

    return () => s.disconnect()
  }

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', loginData)
      localStorage.setItem('token', res.data.token)
      setAuthToken(res.data.token)
      setIsAdmin(true)
      setupSocket(res.data.token)
      fetchOrders()
    } catch (err) {
      setLoginError('Invalid credentials. Please try again.')
      console.error('Login failed:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAdmin(false)
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
    setOrders([])
  }

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div style={{ 
        maxWidth: '400px', 
        margin: '50px auto', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px' 
      }}>
        <h2>Admin Login</h2>
        {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      
      <div>
        <input 
          type="text" 
          placeholder="Search orders..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
        />
      </div>

      <div>
        <h3>Orders</h3>
        {orders.map(order => (
          <div key={order.id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px 0'}}>
            <p>Order ID: {order.id}</p>
            <p>Status: {order.status}</p>
            <p>Customer: {order.customer?.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}