import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:4000/api'

const instance = axios.create({ baseURL: API })

export function setAuthToken(token){
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete instance.defaults.headers.common['Authorization']
}

// initialize from localStorage if present
const t = localStorage.getItem('token')
if (t) setAuthToken(t)

export default instance
