import axios from 'axios'

// In production (Vercel) use VITE_API_URL env var.
// In development, baseURL = '/api' and Vite proxy forwards to localhost:4000.
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('fl_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r.data,
  err => {
    const msg = err.response?.data?.error || 'Ката болду'
    return Promise.reject(new Error(msg))
  }
)

export default api
