import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { useEffect } from 'react'

export default function TopBar() {
  const user    = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)

  // Refill hearts every 2 min in background
  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const { hearts } = await api.post('/users/me/refill')
        if (hearts !== user?.hearts) setUser({ ...user, hearts })
      } catch {}
    }, 120_000)
    return () => clearInterval(t)
  }, [user?.hearts])

  return (
    <div
      className="sticky top-0 z-[100] flex items-center justify-end gap-1.5 px-3 py-2"
      style={{
        background: 'rgba(14,18,32,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        minHeight: 48,
      }}
    >
      {/* Streak */}
      <Pill
        value={user?.streak ?? 0}
        color="#FF9600"
        bg="rgba(255,150,0,0.1)"
        border="rgba(255,150,0,0.2)"
        icon={
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF9600">
            <path d="M12.017 0C9.5 4.5 11 8 8.5 10c.5-2-1-4.5-3-5.5C4 7.5 3 11 5 14c-1.5-.5-2.5-2-2.5-2C1 15 2 18 4 20c-1 0-2-.5-2-.5C3.5 22 7 24 12 24c5.5 0 10-4.5 10-10 0-6-5-10-10-14z"/>
          </svg>
        }
      />

      {/* Gems */}
      <Pill
        value={(user?.gems ?? 0).toLocaleString()}
        color="#1CB0F6"
        bg="rgba(28,176,246,0.1)"
        border="rgba(28,176,246,0.2)"
        icon={
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#1CB0F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12,2 19,8 16,22 8,22 5,8"/>
            <line x1="5" y1="8" x2="19" y2="8"/>
          </svg>
        }
      />

      {/* Hearts */}
      <Hearts hearts={user?.hearts ?? 5} max={user?.maxHearts ?? 5} />
    </div>
  )
}

function Pill({ icon, value, color, bg, border }) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 1.15, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full font-black text-xs flex-shrink-0"
      style={{ background: bg, border: `1px solid ${border}`, color }}
    >
      {icon}
      <span>{value}</span>
    </motion.div>
  )
}

function Hearts({ hearts, max }) {
  return (
    <div
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full flex-shrink-0"
      style={{ background: 'rgba(255,75,75,0.08)', border: '1px solid rgba(255,75,75,0.18)' }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF4B4B">
        <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.6z"/>
      </svg>
      <span className="font-black text-xs" style={{ color: '#FF4B4B' }}>
        {hearts}<span style={{ color: 'rgba(255,75,75,0.45)', fontWeight: 600 }}>/{max}</span>
      </span>
    </div>
  )
}
