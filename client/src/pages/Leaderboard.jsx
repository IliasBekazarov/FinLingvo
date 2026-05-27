import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'
import { LEAGUES } from '@/data/content'
import { useAuthStore } from '@/store/authStore'

const STRIPE = {
  backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
  backgroundSize: '14px 14px',
}

/* ─── Compact league pill selector ───────────────────────── */
function LeaguePill({ league, active, isUser, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="relative flex-shrink-0 flex flex-col items-center gap-1 px-2 py-2.5 rounded-2xl transition-all cursor-pointer"
      style={{
        minWidth: active ? 68 : 52,
        background: active
          ? `linear-gradient(145deg, ${league.bg}, ${league.bg}aa)`
          : 'rgba(255,255,255,0.03)',
        border: `2px solid ${active ? league.color : 'rgba(255,255,255,0.05)'}`,
        boxShadow: active ? `0 0 18px ${league.glowColor}` : 'none',
      }}
    >
      {isUser && (
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
          style={{ background: '#58CC02', fontSize: '0.4rem', fontWeight: 900, color: '#fff' }}>
          ✓
        </div>
      )}
      <span style={{ fontSize: active ? 24 : 18, lineHeight: 1 }}>{league.emoji}</span>
      <span
        className="font-black leading-none"
        style={{
          fontSize: active ? 8 : 7,
          color: active ? league.color : '#3d4860',
          letterSpacing: '0.05em',
        }}
      >
        {league.name}
      </span>
    </motion.button>
  )
}

/* ─── Avatar ──────────────────────────────────────────────── */
function Avatar({ emoji, size = 42, medal }) {
  const medalColors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
  const color = medalColors[medal]
  return (
    <div className="relative flex-shrink-0">
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: size, height: size, fontSize: size * 0.46,
          background: 'linear-gradient(135deg,#162240,#0b1628)',
          border: `${medal ? 2.5 : 1.5}px solid ${color || 'rgba(255,255,255,0.1)'}`,
          boxShadow: color ? `0 0 16px ${color}60` : 'none',
        }}
      >
        {emoji || '👤'}
      </div>
      {medal === 1 && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-base leading-none">👑</div>
      )}
    </div>
  )
}

/* ─── Podium ──────────────────────────────────────────────── */
function Podium({ top3, lg }) {
  if (top3.length < 3) return null
  // order: 2nd, 1st, 3rd
  const slots = [
    { user: top3[1], rank: 2, height: 56,  avatarSize: 52, bg: 'rgba(192,192,192,0.15)', border: 'rgba(192,192,192,0.3)', label: '2' },
    { user: top3[0], rank: 1, height: 80,  avatarSize: 64, bg: 'rgba(255,215,0,0.15)',   border: 'rgba(255,215,0,0.4)',   label: '1' },
    { user: top3[2], rank: 3, height: 40,  avatarSize: 44, bg: 'rgba(205,127,50,0.15)',  border: 'rgba(205,127,50,0.3)', label: '3' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl overflow-hidden mb-4 relative"
      style={{ background: '#131826', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="px-4 py-2.5 border-b border-soft flex items-center gap-2"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: 18 }}>{lg?.emoji}</span>
        <span className="font-extrabold text-sm">Топ 3</span>
        <span className="ml-auto text-[0.6rem] font-bold text-t3">Жуманын лидерлери</span>
      </div>

      <div className="flex items-end justify-center gap-2 px-4 pt-6 pb-0">
        {slots.map(({ user: u, rank, height, avatarSize, bg, border, label }, pi) => (
          <motion.div
            key={rank}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pi * 0.1 + 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col items-center flex-1"
            style={{ maxWidth: 100 }}
          >
            <Avatar emoji={u?.avatar} size={avatarSize} medal={rank} />
            <div className="mt-1.5 text-xs font-extrabold max-w-[72px] text-center truncate">{u?.name}</div>
            <div className="text-[0.58rem] text-t2 font-bold mb-2">
              {(u?.weeklyXP || 0).toLocaleString()} XP
            </div>
            {/* Podium bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ delay: pi * 0.1 + 0.4, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-full rounded-t-2xl flex items-start justify-center pt-2 font-black text-lg relative overflow-hidden"
              style={{ background: bg, border: `1px solid ${border}`, borderBottom: 'none' }}
            >
              <div className="absolute inset-0 opacity-[0.04]" style={STRIPE} />
              <span className="relative" style={{ color: border, fontSize: 20 }}>
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Rank row ────────────────────────────────────────────── */
function RankRow({ u, rank, isMe, idx }) {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const accentColors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
  const accent = accentColors[rank]

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 300, damping: 28 }}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl relative overflow-hidden"
      style={{
        background: isMe ? 'rgba(28,176,246,0.07)' : rank <= 3 ? `${accentColors[rank]}08` : 'transparent',
        border: `1px solid ${isMe ? 'rgba(28,176,246,0.3)' : rank <= 3 ? `${accent}20` : 'rgba(255,255,255,0.05)'}`,
      }}
    >
      {/* Left accent bar for top 3 */}
      {rank <= 3 && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
          style={{ background: accent }} />
      )}
      {isMe && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
          style={{ background: '#1CB0F6' }} />
      )}

      {/* Rank */}
      <div className="w-7 text-center font-black text-sm flex-shrink-0"
        style={{ color: accentColors[rank] || '#3d4860' }}>
        {medals[rank] || <span className="text-xs font-bold" style={{ color: '#3d4860' }}>#{rank}</span>}
      </div>

      <Avatar emoji={u.avatar} size={34} medal={rank <= 3 ? rank : null} />

      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate flex items-center gap-1.5">
          {u.name}
          {isMe && (
            <span className="px-1.5 py-0.5 rounded-full text-[0.55rem] font-black"
              style={{ background: 'rgba(28,176,246,0.15)', color: '#1CB0F6' }}>
              СЕН
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[0.6rem] font-bold text-orange">🔥 {u.streak || 0}</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-black text-sm gradient-text-green">
          {(u.weeklyXP || 0).toLocaleString()}
        </div>
        <div className="text-[0.58rem] text-t3 font-bold">XP</div>
      </div>
    </motion.div>
  )
}

/* ─── Zone separator ──────────────────────────────────────── */
function ZoneBadge({ color, icon, children }) {
  return (
    <div className="flex items-center gap-2 my-2 px-1">
      <div className="flex-1 h-px" style={{ background: `${color}30` }} />
      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.58rem] font-black tracking-wider uppercase"
        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
        {icon} {children}
      </div>
      <div className="flex-1 h-px" style={{ background: `${color}30` }} />
    </div>
  )
}

/* ─── Skeleton loader ─────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="w-7 h-5 rounded-md animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="w-9 h-9 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', width: `${50 + i * 5}%` }} />
            <div className="h-2 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', width: '40%' }} />
          </div>
          <div className="w-12 h-4 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>
      ))}
    </div>
  )
}

/* ─── Main page ───────────────────────────────────────────── */
export default function Leaderboard() {
  const user       = useAuthStore(s => s.user)
  const [league, setLeague] = useState(user?.league || 'bronze')

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', league],
    queryFn:  () => api.get(`/leaderboard?league=${league}`),
  })

  const entries   = data?.entries || []
  const me        = data?.me
  const myRank    = entries.findIndex(e => e.id === me?.id) + 1
  const lg        = LEAGUES.find(l => l.id === league) || LEAGUES[0]
  const activeIdx = LEAGUES.findIndex(l => l.id === league)
  const daysLeft  = Math.max(1, 7 - new Date().getDay())

  return (
    <div className="max-w-[640px] mx-auto px-4 py-5">

      {/* ── League selector strip ── */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-5">
        {LEAGUES.map(l => (
          <LeaguePill
            key={l.id}
            league={l}
            active={league === l.id}
            isUser={l.id === user?.league}
            onClick={() => setLeague(l.id)}
          />
        ))}
      </div>

      {/* ── Active league section (animated on change) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={league}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.22 }}
        >
          {/* League hero banner */}
          <motion.div
            className="rounded-2xl p-4 mb-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${lg.bg} 0%, ${lg.bg}88 50%, #0a0d18 100%)`,
              border: `1px solid ${lg.color}35`,
              boxShadow: `0 0 40px ${lg.glowColor}, 0 8px 32px rgba(0,0,0,0.4)`,
            }}
          >
            <div className="absolute inset-0 opacity-[0.035]" style={STRIPE} />

            {/* Top row: emoji + title */}
            <div className="relative flex items-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background: `${lg.color}20`,
                  border: `1px solid ${lg.color}30`,
                  boxShadow: `0 0 24px ${lg.glowColor}`,
                }}
              >
                {lg.emoji}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.58rem] font-black tracking-[3px] uppercase"
                  style={{ color: lg.color }}>ЖУМАЛЫК РЕЙТИНГ</div>
                <div className="text-xl font-black leading-tight">{lg.name} ЛИГАСЫ</div>
                <div className="text-t3 text-[0.65rem] font-semibold mt-0.5">
                  Жогорку 5 — кийинки лигага
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="relative grid grid-cols-3 gap-2">
              {[
                { val: myRank ? `#${myRank}` : '—', label: 'ОРНУМ',    color: '#1CB0F6', icon: '📊' },
                { val: (me?.weeklyXP ?? 0).toLocaleString(), label: 'ЖУМА XP', color: '#58CC02', icon: '⭐' },
                { val: daysLeft,  label: 'КҮН КАЛДЫ', color: '#FF9600', icon: '⏰' },
              ].map(({ val, label, color, icon }) => (
                <div key={label}
                  className="rounded-xl p-2.5 text-center"
                  style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-base mb-0.5">{icon}</div>
                  <div className="text-lg font-black leading-none" style={{ color }}>{val}</div>
                  <div className="text-[0.55rem] font-extrabold tracking-wider mt-1"
                    style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <div className="bg-card border border-soft rounded-2xl p-3">
              <Skeleton />
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-card border border-soft rounded-2xl py-16 text-center">
              <div className="text-4xl mb-3">{lg.emoji}</div>
              <div className="font-black text-base mb-1">{lg.name} Лигасы</div>
              <div className="text-t3 text-sm">Азырынча колдонуучулар жок</div>
            </div>
          ) : (
            <>
              {entries.length >= 3 && <Podium top3={entries.slice(0, 3)} lg={lg} />}

              <div className="bg-card rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-4 py-2.5 flex items-center gap-2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="font-extrabold text-sm">Рейтинг тизмеси</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[0.6rem] font-black"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#7a859e' }}>
                    {entries.length} оюнчу
                  </span>
                </div>

                <div className="p-2.5 space-y-1">
                  {entries.length > 0 && (
                    <ZoneBadge color="#58CC02" icon="↑">Жогорку зон</ZoneBadge>
                  )}
                  {entries.slice(0, 5).map((e, i) => (
                    <RankRow key={e.id || i} u={e} rank={i+1} isMe={e.id === me?.id} idx={i} />
                  ))}

                  {entries.length > 5 && (
                    <>
                      <ZoneBadge color="#7a859e" icon="↔">Ортоңку зон</ZoneBadge>
                      {entries.slice(5, 8).map((e, i) => (
                        <RankRow key={e.id || i} u={e} rank={i+6} isMe={e.id === me?.id} idx={i+5} />
                      ))}
                    </>
                  )}

                  {entries.length > 8 && (
                    <>
                      <ZoneBadge color="#FF4B4B" icon="↓">Астынкы зон</ZoneBadge>
                      {entries.slice(8).map((e, i) => (
                        <RankRow key={e.id || i} u={e} rank={i+9} isMe={e.id === me?.id} idx={i+8} />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
