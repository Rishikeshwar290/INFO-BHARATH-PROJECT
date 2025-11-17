import React, { useState } from 'react'
import api, { setAuthToken } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const navigate = useNavigate()

  const submit = async () => {
    try{
      const path = isSignup ? '/auth/signup' : '/auth/login'
      const res = await api.post(path, { email, password, name: 'Guest' })
      const { token } = res.data
      localStorage.setItem('token', token)
      setAuthToken(token)
      navigate('/')
    }catch(err){
      console.error(err)
      alert('Auth failed')
    }
  }

  return (
    <div>
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <div>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div>
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div style={{marginTop:12}}>
        <button className="btn" onClick={submit}>{isSignup ? 'Sign up' : 'Login'}</button>
        <button className="btn ghost" onClick={()=>setIsSignup(s=>!s)} style={{marginLeft:8}}>{isSignup ? 'Have account? Login' : 'Create account'}</button>
      </div>
      <div style={{marginTop:10}}>
        <small>Admin seeded: <strong>admin@aniicone.local / admin123</strong></small>
      </div>
    </div>
  )
}
