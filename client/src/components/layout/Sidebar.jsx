import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { LEAGUES } from '@/data/content'

const NAV = [
  { to: '/learn',       id: 'learn',    label: 'Үйрөнүү' },
  { to: '/leaderboard', id: 'league',   label: 'Лига'     },
  { to: '/shop',        id: 'shop',     label: 'Дүкөн'    },
  { to: '/profile',     id: 'profile',  label: 'Профиль'  },
  { to: '/settings',    id: 'settings', label: 'Орнотуу'  },
]

/* ── SVG Icons ────────────────────────────────────────────── */
function NavIcon({ id, active }) {
  const cl = `transition-all duration-200 flex-shrink-0 ${active ? 'text-white' : 'text-t2 group-hover:text-white'}`

  const map = {
    learn: (
      <svg className={cl} width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
    league: (
      <svg className={cl} width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20V14"/>
      </svg>
    ),
    shop: (
      <svg className={cl} width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    profile: (
      <svg className={cl} width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    settings: (
      <svg className={cl} width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  }
  return map[id] ?? null
}

/* ── XP level formula ─────────────────────────────────────── */
function levelOf(xp) { return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1) }
function xpForLevel(lvl) { return Math.pow(lvl - 1, 2) * 100 }

/* ── Main export ──────────────────────────────────────────── */
export default function Sidebar({ open, onClose }) {
  const user   = useAuthStore(s => s.user)
  const league = LEAGUES?.find(l => l.id === user?.league) || LEAGUES?.[0]

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[240px] flex-col z-[200]"
        style={{ background: '#0e1220', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <SidebarContent user={user} league={league} />
      </aside>

      {/* Mobile slide-in */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col z-[200] md:hidden"
            style={{ background: '#0e1220', borderRight: '1px solid rgba(255,255,255,0.05)' }}
          >
            <SidebarContent user={user} league={league} onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

/* ── Sidebar content ──────────────────────────────────────── */
function SidebarContent({ user, league, onClose }) {
  const xp   = user?.xp || 0
  const lvl  = levelOf(xp)
  const curr = xpForLevel(lvl)
  const next = xpForLevel(lvl + 1)
  const pct  = Math.min(100, Math.round(((xp - curr) / (next - curr)) * 100))

  return (
    <div className="flex flex-col h-full px-3 py-4">

      {/* ── Logo ── */}
      <NavLink to="/learn" onClick={onClose} className="flex items-center gap-3 px-2 py-3 mb-2 no-underline group">
        <img
          src="/logo.png"
          alt="FinLingvo"
          className="w-10 h-10 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 object-cover"
          style={{ boxShadow: '0 0 14px rgba(28,176,246,0.25)' }}
        />
        <div className="leading-tight">
          <div className="font-black text-[1.05rem]" style={{
            background: 'linear-gradient(135deg,#fff 0%,#8dcfff 80%,#1CB0F6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            FinLingvo
          </div>
          <div className="text-[0.58rem] font-semibold" style={{ color: '#3d4860' }}>
            Финансылык сабаттуулук
          </div>
        </div>
      </NavLink>

      {/* ── Divider ── */}
      <div className="h-px mx-2 mb-3" style={{ background: 'rgba(255,255,255,0.05)' }} />

      {/* ── Nav ── */}
      <nav className="flex-1 space-y-0.5">
        {NAV.map(({ to, id, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className="no-underline block"
          >
            {({ isActive }) => (
              <motion.div
                whileHover={!isActive ? { x: 3 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150"
                style={isActive ? {
                  background: 'linear-gradient(135deg,#1CB0F6 0%,#0e8ccf 100%)',
                  boxShadow: '0 4px 16px rgba(28,176,246,0.25)',
                } : {}}
              >
                {/* Active indicator strip */}
                {!isActive && (
                  <div className="absolute left-0 w-0.5 h-6 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: '#1CB0F6' }} />
                )}

                <NavIcon id={id} active={isActive} />

                <span className={`font-extrabold text-sm transition-colors duration-150 ${
                  isActive ? 'text-white' : 'text-t2 group-hover:text-white'
                }`}>
                  {label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User card ── */}
      {user && (
        <div className="mt-3 rounded-2xl p-3 transition-all"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${league?.color ? league.color + '30' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg,#162240,#0b1628)',
                border: `2px solid ${league?.color ? league.color + '50' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {user.avatar || '🦅'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-sm text-white truncate">{user.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[0.6rem] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: league?.color + '25', color: league?.color || '#fff' }}>
                  {league?.name}
                </span>
                <span className="text-[0.58rem] font-bold" style={{ color: '#3d4860' }}>
                  LVL {levelOf(xp)}
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[0.58rem] font-bold" style={{ color: '#3d4860' }}>XP</span>
              <span className="text-[0.58rem] font-black" style={{ color: '#1CB0F6' }}>
                {xp.toLocaleString()} / {next.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#1CB0F6,#58CC02)' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
