import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'
import { LEAGUES } from '@/data/content'
import { useAuthStore } from '@/store/authStore'

/* ─── League Card ─────────────────────────────────────────── */
function LeagueCard({ league, active, onClick, userLeague }) {
  const isUser = league.id === userLeague
  const W  = active ? 108 : 76
  const H  = active ? 148 : 106
  const FS = active ? 40  : 26

  return (
    <motion.button
      onClick={onClick}
      animate={{ width: W, height: H }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
      className="relative flex-shrink-0 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{
        gap: 6,
        borderRadius: 18,
        border: `2px solid ${active ? league.color : 'rgba(255,255,255,0.07)'}`,
        background: active
          ? `linear-gradient(145deg, ${league.bg} 0%, ${league.bg}bb 100%)`
          : '#131826',
        boxShadow: active
          ? `0 0 22px ${league.glowColor}, 0 6px 20px rgba(0,0,0,0.5)`
          : 'none',
      }}
    >
      {/* User badge */}
      {isUser && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 15, height: 15, borderRadius: '50%',
          background: '#58CC02',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.45rem', fontWeight: 900, color: '#fff',
        }}>✓</div>
      )}

      {/* Emoji */}
      <motion.span
        animate={{ fontSize: FS }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        style={{ lineHeight: 1 }}
      >
        {league.emoji}
      </motion.span>

      {/* Name */}
      <motion.div
        animate={{ fontSize: active ? 11 : 9 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        style={{
          fontWeight: 900,
          color: active ? league.color : '#7a859e',
          letterSpacing: '0.06em',
          lineHeight: 1.1,
          textAlign: 'center',
          padding: '0 4px',
        }}
      >
        {league.name}
      </motion.div>

      {/* Min XP */}
      <div style={{ fontSize: 8, fontWeight: 700, color: '#3d4860' }}>
        {league.minXP}+ XP
      </div>
    </motion.button>
  )
}

/* ─── Avatar ─────────────────────────────────────────────── */
function Avatar({ emoji, size = 42, gold = false }) {
  return (
    <div
      className="rounded-full bg-gradient-to-br from-[#162240] to-[#0b1628] flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.48,
        border: gold ? '2.5px solid #FFD700' : '1.5px solid rgba(255,255,255,0.1)',
        boxShadow: gold ? '0 0 18px rgba(255,215,0,0.35)' : 'none',
      }}
    >
      {emoji || '👤'}
    </div>
  )
}

/* ─── Podium ─────────────────────────────────────────────── */
function Podium({ top3, lg }) {
  if (top3.length < 3) return null
  const order   = [top3[1], top3[0], top3[2]]
  const sizes   = [52, 66, 44]
  const heights = [52, 72, 40]
  const labels  = ['🥈', '🥇', '🥉']

  return (
    <div className="bg-card border border-soft rounded-2xl overflow-hidden mb-4">
      <div className="px-4 py-2.5 border-b border-soft font-extrabold text-sm flex items-center gap-2">
        <span style={{ fontSize: 20 }}>{lg?.emoji}</span>
        Топ 3
      </div>
      <div className="flex items-end justify-center gap-3 sm:gap-5 px-4 pt-5 pb-3">
        {order.map((u, pi) => u ? (
          <motion.div
            key={pi}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pi * 0.12 }}
            className="flex flex-col items-center gap-1"
          >
            <Avatar emoji={u.avatar} size={sizes[pi]} gold={pi === 1} />
            <div className="text-xs font-extrabold max-w-[64px] text-center truncate">{u.name}</div>
            <div className="text-[0.58rem] text-t2 font-bold">{(u.weeklyXP||0).toLocaleString()} XP</div>
            <div
              className="rounded-t-xl flex items-center justify-center text-xl"
              style={{
                width: 68, height: heights[pi],
                background: pi === 1
                  ? 'linear-gradient(180deg,rgba(255,215,0,0.18),rgba(255,215,0,0.06))'
                  : pi === 0
                  ? 'linear-gradient(180deg,rgba(192,192,192,0.15),rgba(192,192,192,0.05))'
                  : 'linear-gradient(180deg,rgba(205,127,50,0.15),rgba(205,127,50,0.05))',
                border: '1px solid rgba(255,255,255,0.07)',
                borderBottom: 'none',
              }}
            >
              {labels[pi]}
            </div>
          </motion.div>
        ) : null)}
      </div>
    </div>
  )
}

/* ─── Row ────────────────────────────────────────────────── */
function Row({ u, rank, isMe, idx }) {
  const medals     = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const rankColors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.035 }}
      className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2.5 rounded-xl border transition-all ${
        isMe        ? 'border-blue/40 bg-blue/5'
        : rank <= 3 ? 'border-yellow/15 bg-transparent'
        :             'border-soft bg-transparent'
      }`}
    >
      <div className="w-7 sm:w-8 text-center font-black text-sm flex-shrink-0"
        style={{ color: rankColors[rank] || '#3d4860' }}>
        {medals[rank] || `#${rank}`}
      </div>
      <Avatar emoji={u.avatar} size={36} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">
          {u.name}
          {isMe && <span className="ml-1.5 text-blue text-[0.62rem] font-extrabold">(Сен)</span>}
        </div>
        <div className="text-orange text-xs font-bold mt-0.5">🔥 {u.streak || 0} күн</div>
      </div>
      <div className="gradient-text-green font-black text-sm flex-shrink-0">
        {(u.weeklyXP || 0).toLocaleString()} XP
      </div>
    </motion.div>
  )
}

function ZoneLabel({ color, children }) {
  return (
    <div className="text-[0.58rem] font-black tracking-[2px] uppercase py-1.5 px-1"
      style={{ color }}>
      {children}
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────── */
export default function Leaderboard() {
  const user   = useAuthStore(s => s.user)
  const [league, setLeague] = useState(user?.league || 'bronze')
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', league],
    queryFn:  () => api.get(`/leaderboard?league=${league}`),
  })

  const entries  = data?.entries || []
  const me       = data?.me
  const myRank   = entries.findIndex(e => e.id === me?.id) + 1
  const lg       = LEAGUES.find(l => l.id === league) || LEAGUES[0]
  const activeIdx = LEAGUES.findIndex(l => l.id === league)
  const daysLeft = Math.max(1, 7 - new Date().getDay())

  function handleArrow() {
    const nextIdx = (activeIdx + 1) % LEAGUES.length
    setLeague(LEAGUES[nextIdx].id)
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 py-5">

      {/* Header */}
      <h2 className="text-base font-black text-t2 tracking-wider mb-4">
        БАРДЫК ЛИГАЛАР
      </h2>

      {/* League cards carousel */}
      <div className="mb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory">
          {LEAGUES.map(l => (
            <div key={l.id} className="snap-start flex-shrink-0">
              <LeagueCard
                league={l}
                active={league === l.id}
                userLeague={user?.league}
                onClick={() => setLeague(l.id)}
              />
            </div>
          ))}

          {/* Arrow — next league */}
          <button
            onClick={handleArrow}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ml-1 transition-all active:scale-90 hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {LEAGUES.map((l, i) => (
            <motion.div
              key={l.id}
              onClick={() => setLeague(l.id)}
              animate={{ width: i === activeIdx ? 20 : 6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="h-1.5 rounded-full cursor-pointer"
              style={{ background: i === activeIdx ? lg.color : 'rgba(255,255,255,0.14)' }}
            />
          ))}
        </div>
      </div>

      {/* League detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={league}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-5"
        >
          {/* League header card */}
          <div
            className="rounded-2xl p-4 sm:p-5 mb-5 relative overflow-hidden border"
            style={{
              background: `linear-gradient(135deg, ${lg.bg}, #0a0d18)`,
              borderColor: `${lg.color}40`,
              boxShadow: `0 0 36px ${lg.glowColor}`,
            }}
          >
            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
              backgroundSize: '14px 14px',
            }}/>

            <div className="relative flex items-center gap-3 sm:gap-4">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  fontSize: 32,
                  background: `${lg.color}18`,
                  boxShadow: `0 0 22px ${lg.glowColor}`,
                }}
              >
                {lg.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.6rem] font-black tracking-[3px] uppercase mb-0.5"
                  style={{ color: lg.color }}>
                  ЖУМАЛЫК РЕЙТИНГ
                </div>
                <div className="text-xl sm:text-2xl font-black">{lg.name} ЛИГАСЫ</div>
                <div className="text-t2 text-xs font-semibold mt-0.5">Эң жогорку 5 жогорулайт</div>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-2 sm:gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { val: myRank ? `#${myRank}` : '—', label: 'МЕНИН ОРНУМ', color: '#1CB0F6' },
                { val: me?.weeklyXP ?? 0,            label: 'ЖУМАЛЫК XP',  color: '#58CC02' },
                { val: daysLeft,                      label: 'КҮН КАЛДЫ',   color: '#FF9600' },
              ].map(({ val, label, color }) => (
                <div key={label} className="text-center flex-1">
                  <div className="text-lg sm:text-xl font-black" style={{ color }}>{val}</div>
                  <div className="text-[0.56rem] font-extrabold tracking-wider" style={{ color: '#3d4860' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="flex justify-center py-14">
              <div className="w-10 h-10 border-[3px] border-card3 border-t-blue rounded-full animate-spin-slow" />
            </div>
          ) : (
            <>
              {entries.length >= 3 && <Podium top3={entries.slice(0, 3)} lg={lg} />}

              <div className="bg-card border border-soft rounded-2xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-soft font-extrabold text-sm flex items-center gap-2">
                  📋 Рейтинг
                  <span className="ml-auto text-[0.6rem] text-t3 font-bold">{entries.length} колдонуучу</span>
                </div>
                <div className="p-2.5 sm:p-3 space-y-1.5">
                  {entries.length === 0 ? (
                    <div className="text-center py-8 text-t3 font-semibold text-sm">
                      Бул лигада колдонуучулар жок
                    </div>
                  ) : (
                    <>
                      <ZoneLabel color="#58CC02">↑ ЖОГОРКУ ЗОН — КӨТӨРҮЛҮҮ</ZoneLabel>
                      {entries.slice(0, 5).map((e, i) => (
                        <Row key={e.id || i} u={e} rank={i+1} isMe={e.id === me?.id} idx={i} />
                      ))}
                      {entries.length > 5 && (
                        <>
                          <ZoneLabel color="#7a859e">ОРТОҢКУ ЗОН</ZoneLabel>
                          {entries.slice(5, 8).map((e, i) => (
                            <Row key={e.id || i} u={e} rank={i+6} isMe={e.id === me?.id} idx={i+5} />
                          ))}
                        </>
                      )}
                      {entries.length > 8 && (
                        <>
                          <ZoneLabel color="#FF4B4B">↓ АСТЫНКЫ ЗОН — ТҮШҮҮ</ZoneLabel>
                          {entries.slice(8).map((e, i) => (
                            <Row key={e.id || i} u={e} rank={i+9} isMe={e.id === me?.id} idx={i+8} />
                          ))}
                        </>
                      )}
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
