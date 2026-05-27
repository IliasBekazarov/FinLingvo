import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { MODULES, ACHIEVEMENTS, LEAGUES } from '@/data/content'
import { useNavigate } from 'react-router-dom'

/* Stripe texture identical to Learn/Leaderboard */
const STRIPE = {
  backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
  backgroundSize: '14px 14px',
}

function levelOf(xp) { return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1) }

export default function Profile() {
  const user     = useAuthStore(s => s.user)
  const logout   = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  const progress     = user?.progress     || []
  const achievements = user?.achievements || []

  const league = LEAGUES?.find(l => l.id === user?.league) || { emoji: '🥉', name: 'Жез', color: '#CD7F32', glowColor: 'rgba(205,127,50,0.3)', bg: '#2a1a08' }
  const lvl    = levelOf(user?.xp || 0)
  const prevXP = Math.pow(lvl - 1, 2) * 100
  const nextXP = Math.pow(lvl, 2) * 100
  const pct    = Math.min(100, Math.round(((user?.xp - prevXP) / (nextXP - prevXP)) * 100)) || 0
  const done   = progress.filter(p => p.completed !== false).length

  function modProgress(modId) {
    const mod = MODULES?.find(m => m.id === modId)
    if (!mod) return { done: 0, total: 0, pct: 0 }
    const total = mod.lessons.length
    const d     = mod.lessons.filter(l => progress.some(p => p.lessonId === l.id)).length
    return { done: d, total, pct: Math.round((d / total) * 100) }
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 py-5 space-y-4">

      {/* ── Hero card — same gradient+glow+stripe as Leaderboard league header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden border relative"
        style={{
          background: `linear-gradient(135deg, ${league.bg || '#1a1a2a'} 0%, #0a0d18 100%)`,
          borderColor: `${league.color}35`,
          boxShadow: `0 0 36px ${league.glowColor}`,
        }}
      >
        {/* Stripe texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={STRIPE} />

        {/* Avatar + name + progress */}
        <div className="relative flex items-center gap-3 sm:gap-4 p-4 sm:p-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-4xl sm:text-5xl"
              style={{
                background: 'linear-gradient(135deg,#162240,#0b1628)',
                border: `3px solid ${league.color}50`,
                boxShadow: `0 0 20px ${league.glowColor}`,
              }}
            >
              {user?.avatar || '🦅'}
            </div>
            <div
              className="absolute -bottom-1 -right-1 font-black text-[0.58rem] px-1.5 py-0.5 rounded-full border-2 border-[#0a0d18] whitespace-nowrap"
              style={{ background: league.color, color: '#fff' }}
            >
              LVL {lvl}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-black truncate">{user?.name}</h2>
            <div className="text-t2 text-xs sm:text-sm font-semibold mt-0.5">
              {league.emoji} {league.name} Лигасы · Деңгээл {lvl}
            </div>
            <div className="mt-2.5 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${league.color}, ${league.color}cc)` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[0.6rem] font-extrabold text-t3">
              <span>{user?.xp?.toLocaleString()} XP</span>
              <span>→ {lvl + 1}: {nextXP.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="relative grid grid-cols-2 gap-2 p-3 sm:p-4">
          {[
            { icon: '⭐', val: (user?.xp||0).toLocaleString(),  label: 'Жалпы XP',   cls: 'gradient-text-gold'  },
            { icon: '🔥', val: user?.streak || 0,               label: 'Streak',      cls: 'text-orange'         },
            { icon: '💎', val: (user?.gems||0).toLocaleString(), label: 'Gems',        cls: 'gradient-text-blue'  },
            { icon: '✅', val: done,                             label: 'Сабактар',    cls: 'gradient-text-green' },
          ].map(({ icon, val, label, cls }) => (
            <div key={label}
              className="rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-2xl sm:text-3xl flex-shrink-0">{icon}</span>
              <div className="min-w-0">
                <div className={`text-xl sm:text-2xl font-black ${cls}`}>{val}</div>
                <div className="text-[0.6rem] text-t2 font-extrabold uppercase tracking-wider">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Module progress ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-card border border-soft rounded-2xl overflow-hidden"
      >
        <div className="px-4 py-2.5 border-b border-soft text-[0.62rem] font-black tracking-[2.5px] uppercase text-t3">
          Бөлүм Прогресси
        </div>
        <div className="p-4 space-y-3.5">
          {MODULES?.map(m => {
            const { done: d, total, pct: p } = modProgress(m.id)
            return (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-xl flex-shrink-0">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold mb-1.5 truncate">{m.title}</div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: m.color }}
                    />
                  </div>
                </div>
                <span className="text-xs font-extrabold flex-shrink-0 ml-1" style={{ color: m.color }}>
                  {d}/{total}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ── Achievements ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bg-card border border-soft rounded-2xl overflow-hidden"
      >
        <div className="px-4 py-2.5 border-b border-soft text-[0.62rem] font-black tracking-[2.5px] uppercase text-t3">
          Жетишкендиктер
        </div>
        <div className="p-3 sm:p-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
          {ACHIEVEMENTS?.map(a => {
            const earned = achievements.some(u => u.achievementId === a.id)
            return (
              <div
                key={a.id}
                className={`rounded-xl p-2.5 text-center border transition-all ${
                  earned ? 'active:scale-95' : 'opacity-30 grayscale'
                }`}
                style={{
                  borderColor: earned ? 'rgba(255,217,0,0.28)' : 'rgba(255,255,255,0.06)',
                  background:  earned ? 'rgba(255,217,0,0.07)'  : 'transparent',
                }}
              >
                <div className="text-2xl sm:text-3xl mb-1">{a.icon}</div>
                <div className="text-[0.6rem] sm:text-[0.65rem] text-t2 font-bold leading-tight">{a.title}</div>
                {earned && (
                  <div className="text-[0.52rem] font-semibold mt-0.5 leading-tight" style={{ color: '#FFD90060' }}>
                    {a.description}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ── Logout ── */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        onClick={() => { if (confirm('Чыккыңыз келеби?')) { logout(); navigate('/') } }}
        className="w-full py-3.5 rounded-2xl font-black text-sm tracking-wider uppercase transition-all active:scale-[0.98]"
        style={{
          background: 'rgba(255,75,75,0.06)',
          border: '1px solid rgba(255,75,75,0.3)',
          color: '#FF4B4B',
        }}
      >
        🚪 ЧЫГУУ
      </motion.button>
    </div>
  )
}
