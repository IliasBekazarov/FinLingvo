import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const TABS = [
  {
    to: '/learn', label: 'Үйрөнүү',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
  },
  {
    to: '/leaderboard', label: 'Лига',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20V14"/>
      </svg>
    ),
  },
  {
    to: '/shop', label: 'Дүкөн',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    to: '/profile', label: 'Профиль',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export default function MobileNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden z-[200]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'rgba(14,18,32,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex justify-around items-center py-2 px-2">
        {TABS.map(({ to, icon, label }) => {
          const active = pathname === to || pathname.startsWith(to + '/')
          return (
            <NavLink
              key={to}
              to={to}
              className="no-underline flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex flex-col items-center gap-0.5 py-1.5 relative"
              >
                {/* Active dot */}
                {active && (
                  <motion.div
                    layoutId="mobile-dot"
                    className="absolute -top-0.5 w-1 h-1 rounded-full"
                    style={{ background: '#1CB0F6', boxShadow: '0 0 6px #1CB0F6' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div style={{ color: active ? '#1CB0F6' : '#3d4860' }}
                  className="transition-colors duration-200">
                  {icon}
                </div>

                {/* Label */}
                <span
                  className="text-[0.55rem] font-extrabold tracking-wide transition-colors duration-200"
                  style={{ color: active ? '#1CB0F6' : '#3d4860' }}
                >
                  {label}
                </span>
              </motion.div>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
