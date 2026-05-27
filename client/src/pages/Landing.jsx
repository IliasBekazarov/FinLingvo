import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function Landing() {
  const [tab, setTab]       = useState('login')
  const [loading, setLoading] = useState(false)
  const setAuth  = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  async function handleAuth(e) {
    e.preventDefault()
    const fd   = new FormData(e.target)
    const body = Object.fromEntries(fd)
    setLoading(true)
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register'
      const { token, user } = await api.post(endpoint, body)
      setAuth(token, user)
      navigate('/learn')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-green/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm z-10"
      >
        <div className="bg-card border border-soft2 rounded-3xl p-7 shadow-card-lg">
          {/* Logo */}
          <div className="flex flex-col items-center mb-5">
            <img
              src="/logo.png"
              alt="FinLingvo"
              className="w-16 h-16 rounded-2xl object-cover animate-float mb-2"
              style={{ boxShadow: '0 0 24px rgba(28,176,246,0.35)' }}
            />
            <div className="text-lg font-black tracking-wide" style={{
              background: 'linear-gradient(160deg,#fff 0%,#a8ccf0 60%,#1CB0F6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>FinLingvo</div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-card2 rounded-xl mb-5">
            {['login', 'register'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-xl font-extrabold text-sm transition-all ${
                  tab === t ? 'bg-blue text-white shadow-blue-glow' : 'text-t2 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Кируу' : 'Каттоо'}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
            {tab === 'register' && (
              <input
                name="name"
                placeholder="Атыңыз"
                required
                className="w-full bg-card2 border border-soft rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-t3 outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-all"
              />
            )}
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full bg-card2 border border-soft rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-t3 outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-all"
            />
            <input
              name="password"
              type="password"
              placeholder="Сырсөз"
              required
              minLength={6}
              className="w-full bg-card2 border border-soft rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-t3 outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue hover:bg-blue-dark text-white font-black text-sm tracking-widest uppercase rounded-2xl transition-all shadow-blue-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '...' : tab === 'login' ? 'КИРУУ' : 'КАТТАЛУУ'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
