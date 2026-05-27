import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'
import { LEAGUES } from '@/data/content'
import { useAuthStore } from '@/store/authStore'

/* ── Stripe texture ──────────────────────────────────────────── */
const STRIPE = {
  backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
  backgroundSize: '14px 14px',
}

/* ══════════════════════════════════════════════════════════════
   LeagueChip — horizontal scrollable selector
══════════════════════════════════════════════════════════════ */
function LeagueChip({ lg, active, isUser, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className="relative flex-shrink-0 flex flex-col items-center justify-center rounded-2xl cursor-pointer"
      style={{
        width: active ? 72 : 58,
        height: 64,
        background: active
          ? `linear-gradient(145deg,${lg.bg},${lg.bg}bb)`
          : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${active ? lg.color + '70' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: active ? `0 0 22px ${lg.glowColor}, 0 4px 16px rgba(0,0,0,0.4)` : 'none',
        transition: 'width 0.25s ease, background 0.2s, border-color 0.2s, box-shadow 0.2s',
        gap: 5,
      }}
    >
      {/* "СЕН" badge on user's league */}
      {isUser && (
        <div
          className="absolute -top-1.5 -right-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none"
          style={{ background: '#58CC02', color: '#fff', boxShadow: '0 2px 8px rgba(88,204,2,0.5)' }}
        >
          СЕН
        </div>
      )}

      {/* Emoji */}
      <motion.span
        animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={{ duration: 2.8, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
        style={{ fontSize: active ? 26 : 20, lineHeight: 1 }}
      >
        {lg.emoji}
      </motion.span>

      {/* Name */}
      <span
        className="font-black leading-none"
        style={{
          fontSize: active ? 8 : 7,
          color: active ? lg.color : '#2d3448',
          letterSpacing: '0.08em',
        }}
      >
        {lg.name}
      </span>
    </motion.button>
  )
}

/* ══════════════════════════════════════════════════════════════
   Avatar
══════════════════════════════════════════════════════════════ */
function Avatar({ emoji, size = 40, rank }) {
  const ringColor = rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : null

  return (
    <div className="relative flex-shrink-0">
      <motion.div
        animate={rank === 1 ? {
          boxShadow: ['0 0 0 0 #FFD70000','0 0 0 6px #FFD70030','0 0 0 0 #FFD70000'],
        } : {}}
        transition={{ duration: 2.4, repeat: Infinity }}
        className="rounded-full flex items-center justify-center"
        style={{
          width: size, height: size, fontSize: size * 0.46,
          background: 'linear-gradient(145deg,#1a2640,#0d1628)',
          border: `2px solid ${ringColor || 'rgba(255,255,255,0.08)'}`,
        }}
      >
        {emoji || '👤'}
      </motion.div>
      {rank === 1 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl leading-none select-none">
          👑
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   Podium
══════════════════════════════════════════════════════════════ */
function Podium({ top3, lg }) {
  if (top3.length < 3) return null

  const SLOTS = [
    { u: top3[1], rank: 2, barH: 58,  avSz: 50, color: '#C0C0C0', medal: '🥈' },
    { u: top3[0], rank: 1, barH: 88,  avSz: 62, color: '#FFD700', medal: '🥇' },
    { u: top3[2], rank: 3, barH: 40,  avSz: 44, color: '#CD7F32', medal: '🥉' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.38 }}
      className="rounded-2xl overflow-hidden mb-4"
      style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="text-xl leading-none">{lg?.emoji}</span>
        <span className="font-extrabold text-sm text-white">Топ 3</span>
        <span className="ml-auto text-[0.58rem] font-bold" style={{ color: '#2d3448' }}>
          жума лидерлери
        </span>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 px-5 pt-8 pb-0">
        {SLOTS.map(({ u, rank, barH, avSz, color, medal }, pi) => (
          <motion.div
            key={rank}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + pi * 0.1, type: 'spring', stiffness: 220, damping: 22 }}
            className="flex flex-col items-center flex-1"
          >
            <Avatar emoji={u?.avatar} size={avSz} rank={rank} />
            <div
              className="mt-2 text-xs font-extrabold text-center truncate w-full px-1"
              style={{ color: rank === 1 ? '#fff' : '#7a859e', fontSize: rank === 1 ? 12 : 10 }}
            >
              {u?.name}
            </div>
            <div
              className="font-black mb-2.5"
              style={{ color, fontSize: 10 }}
            >
              {(u?.weeklyXP || 0).toLocaleString()} XP
            </div>

            {/* Animated bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: barH }}
              transition={{ delay: 0.38 + pi * 0.1, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-full rounded-t-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(180deg,${color}22,${color}08)`,
                border: `1px solid ${color}30`,
                borderBottom: 'none',
              }}
            >
              <div className="absolute inset-0 opacity-[0.04]" style={STRIPE} />
              <span style={{ fontSize: 20 }}>{medal}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   RankRow
══════════════════════════════════════════════════════════════ */
function RankRow({ u, rank, isMe, idx }) {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const accentMap = { 1: '#FFD700', 2: '#B8BCC8', 3: '#CD7F32' }
  const accent = accentMap[rank]

  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.028, type: 'spring', stiffness: 300, damping: 28 }}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl relative overflow-hidden"
      style={{
        background: isMe
          ? 'linear-gradient(135deg,rgba(28,176,246,0.1),rgba(28,176,246,0.03))'
          : rank <= 3
            ? `linear-gradient(135deg,${accent}09,transparent)`
            : 'rgba(255,255,255,0.015)',
        border: `1px solid ${
          isMe      ? 'rgba(28,176,246,0.3)' :
          rank <= 3 ? `${accent}20`          :
          'rgba(255,255,255,0.04)'
        }`,
      }}
    >
      {/* Left accent strip */}
      {(rank <= 3 || isMe) && (
        <div
          className="absolute left-0 top-[18%] bottom-[18%] w-[3px] rounded-r-full"
          style={{ background: isMe ? '#1CB0F6' : accent }}
        />
      )}

      {/* Rank */}
      <div className="w-8 text-center flex-shrink-0">
        {medals[rank]
          ? <span className="text-base leading-none">{medals[rank]}</span>
          : <span className="font-black text-xs" style={{ color: '#2d3448' }}>#{rank}</span>
        }
      </div>

      <Avatar emoji={u.avatar} size={34} rank={rank <= 3 ? rank : null} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sm truncate text-white">{u.name}</span>
          {isMe && (
            <span
              className="flex-shrink-0 px-1.5 py-0.5 rounded-full font-black leading-none"
              style={{ fontSize: 9, background: 'rgba(28,176,246,0.18)', color: '#1CB0F6' }}
            >
              СЕН
            </span>
          )}
        </div>
        <div className="text-[0.58rem] font-bold mt-0.5" style={{ color: '#FF9600' }}>
          🔥 {u.streak || 0} күн
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div
          className="font-black text-sm"
          style={{
            color: rank === 1 ? '#FFD700' :
                   rank === 2 ? '#C0C0C0' :
                   rank === 3 ? '#CD7F32' :
                   isMe       ? '#1CB0F6' : '#58CC02',
          }}
        >
          {(u.weeklyXP || 0).toLocaleString()}
        </div>
        <div className="font-black tracking-widest" style={{ fontSize: 9, color: '#2d3448' }}>XP</div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ZoneBadge
══════════════════════════════════════════════════════════════ */
function ZoneBadge({ color, icon, label }) {
  return (
    <div className="flex items-center gap-2.5 my-3">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${color}35,transparent)` }} />
      <div
        className="flex items-center gap-1 px-3 py-1 rounded-full font-black tracking-widest uppercase"
        style={{
          fontSize: 9,
          background: `${color}10`,
          color,
          border: `1px solid ${color}28`,
        }}
      >
        {icon} {label}
      </div>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,transparent,${color}35)` }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   Skeleton loader
══════════════════════════════════════════════════════════════ */
function Skeleton() {
  return (
    <div className="space-y-2 p-3">
      {[80, 65, 72, 55, 68, 50, 60, 45].map((w, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="w-8 h-4 rounded-md animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="w-[34px] h-[34px] rounded-full animate-pulse flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', width: `${w}%` }} />
            <div className="h-2 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', width: '35%' }} />
          </div>
          <div className="w-10 h-4 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   Main Page
══════════════════════════════════════════════════════════════ */
export default function Leaderboard() {
  const user = useAuthStore(s => s.user)
  const [league, setLeague] = useState(user?.league || 'bronze')

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', league],
    queryFn:  () => api.get(`/leaderboard?league=${league}`),
  })

  const entries  = data?.entries || []
  const me       = data?.me
  const myRank   = entries.findIndex(e => e.id === me?.id) + 1
  const lg       = LEAGUES.find(l => l.id === league) || LEAGUES[0]
  const daysLeft = Math.max(1, 7 - new Date().getDay())

  return (
    <div className="max-w-[640px] mx-auto px-4 py-5">

      {/* ── League selector strip ── */}
      <div className="relative mb-5">
        {/* Right fade hint */}
        <div
          className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent,#0e1220)' }}
        />
        <div
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {LEAGUES.map(l => (
            <LeagueChip
              key={l.id}
              lg={l}
              active={league === l.id}
              isUser={l.id === user?.league}
              onClick={() => setLeague(l.id)}
            />
          ))}
          {/* Buffer so last item clears the fade */}
          <div className="w-4 flex-shrink-0" />
        </div>
      </div>

      {/* ── Content — animated on league change ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={league}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, scale: 0.99 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── Hero banner ── */}
          <motion.div
            className="rounded-3xl p-5 mb-5 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg,${lg.bg} 0%,${lg.bg}55 55%,#07090f 100%)`,
              border: `1px solid ${lg.color}32`,
              boxShadow: `0 0 52px ${lg.glowColor}, 0 16px 48px rgba(0,0,0,0.55)`,
            }}
          >
            <div className="absolute inset-0 opacity-[0.03]" style={STRIPE} />
            {/* Ambient orb */}
            <div
              className="absolute -top-14 -right-14 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: lg.color, opacity: 0.1 }}
            />

            {/* League identity row */}
            <div className="relative flex items-center gap-4 mb-5">
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 18px ${lg.glowColor}`,
                    `0 0 44px ${lg.glowColor}`,
                    `0 0 18px ${lg.glowColor}`,
                  ],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                style={{
                  background: `${lg.color}16`,
                  border: `1px solid ${lg.color}32`,
                }}
              >
                {lg.emoji}
              </motion.div>

              <div className="flex-1 min-w-0">
                <div
                  className="font-black tracking-[3px] uppercase mb-0.5"
                  style={{ fontSize: 9, color: lg.color }}
                >
                  ЖУМАЛЫК РЕЙТИНГ
                </div>
                <div className="text-xl font-black leading-tight text-white">
                  {lg.name} ЛИГАСЫ
                </div>
                <div className="font-semibold mt-0.5" style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>
                  Жогорку 5 → кийинки лигага чыгат
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="relative grid grid-cols-3 gap-2.5">
              {[
                { v: myRank ? `#${myRank}` : '—',          label: 'ОРНУМ',      color: '#1CB0F6', icon: '📊' },
                { v: (me?.weeklyXP ?? 0).toLocaleString(),  label: 'ЖУМА XP',   color: '#58CC02', icon: '⭐' },
                { v: `${daysLeft}`,                         label: 'КҮН КАЛДЫ', color: '#FF9600', icon: '⏰' },
              ].map(({ v, label, color, icon }) => (
                <div
                  key={label}
                  className="rounded-2xl p-3 text-center"
                  style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="text-lg mb-0.5">{icon}</div>
                  <div className="text-base font-black leading-none" style={{ color }}>{v}</div>
                  <div
                    className="font-extrabold tracking-widest uppercase mt-1"
                    style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)' }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Rank content ── */}
          {isLoading ? (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Skeleton />
            </div>
          ) : entries.length === 0 ? (
            <div
              className="rounded-2xl py-16 text-center"
              style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-5xl mb-3">{lg.emoji}</div>
              <div className="font-black text-base text-white mb-1">{lg.name} Лигасы</div>
              <div className="text-sm" style={{ color: '#2d3448' }}>Азырынча оюнчулар жок</div>
            </div>
          ) : (
            <>
              {/* Podium */}
              {entries.length >= 3 && <Podium top3={entries.slice(0, 3)} lg={lg} />}

              {/* Full rank list */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* List header */}
                <div
                  className="px-4 py-3 flex items-center gap-2.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className="font-extrabold text-sm text-white">Рейтинг</span>
                  <div
                    className="px-2 py-0.5 rounded-full font-black"
                    style={{ fontSize: 10, background: 'rgba(255,255,255,0.05)', color: '#2d3448' }}
                  >
                    {entries.length} оюнчу
                  </div>
                </div>

                <div className="p-2.5 space-y-1">
                  <ZoneBadge color="#58CC02" icon="↑" label="ЖОГОРКУ ЗОН" />
                  {entries.slice(0, 5).map((e, i) => (
                    <RankRow key={e.id || i} u={e} rank={i + 1} isMe={e.id === me?.id} idx={i} />
                  ))}

                  {entries.length > 5 && (
                    <>
                      <ZoneBadge color="#7a859e" icon="↔" label="ОРТОҢКУ ЗОН" />
                      {entries.slice(5, 8).map((e, i) => (
                        <RankRow key={e.id || i} u={e} rank={i + 6} isMe={e.id === me?.id} idx={i + 5} />
                      ))}
                    </>
                  )}

                  {entries.length > 8 && (
                    <>
                      <ZoneBadge color="#FF4B4B" icon="↓" label="АСТЫНКЫ ЗОН" />
                      {entries.slice(8).map((e, i) => (
                        <RankRow key={e.id || i} u={e} rank={i + 9} isMe={e.id === me?.id} idx={i + 8} />
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
