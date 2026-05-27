/**
 * Leaderboard — mobile-first, premium, card-based layout
 * ∙ No tables, no excessive animations
 * ∙ Name = primary focus, Score = visually dominant
 * ∙ 44–56px touch targets throughout
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'
import { LEAGUES } from '@/data/content'
import { useAuthStore } from '@/store/authStore'

/* ── helpers ─────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 10 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.22, delay },
})

/* ══════════════════════════════════════════════════════════════
   LeagueChip
══════════════════════════════════════════════════════════════ */
function LeagueChip({ lg, active, isUser, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="relative flex-shrink-0 flex flex-col items-center justify-center rounded-xl cursor-pointer"
      style={{
        width:      active ? 60 : 48,
        height:     52,
        gap:        4,
        background: active ? lg.bg + 'cc' : 'rgba(255,255,255,0.03)',
        border:     `1.5px solid ${active ? lg.color + '65' : 'rgba(255,255,255,0.06)'}`,
        boxShadow:  active ? `0 0 16px ${lg.glowColor}` : 'none',
        transition: 'width 0.22s ease, background 0.18s, border-color 0.18s, box-shadow 0.18s',
      }}
    >
      {isUser && (
        <div
          className="absolute -top-1.5 -right-1.5 font-black rounded-full"
          style={{ fontSize: 7, background: '#58CC02', color: '#fff', padding: '2px 5px', lineHeight: 1.4 }}
        >
          СЕН
        </div>
      )}
      <span style={{ fontSize: active ? 21 : 17, lineHeight: 1 }}>{lg.emoji}</span>
      <span style={{ fontSize: 7, fontWeight: 900, color: active ? lg.color : '#2d3448', letterSpacing: '0.06em' }}>
        {lg.name}
      </span>
    </motion.button>
  )
}

/* ══════════════════════════════════════════════════════════════
   League hero card  (compact, info-dense, NO infinite animations)
══════════════════════════════════════════════════════════════ */
function LeagueHero({ lg, myRank, me, daysLeft }) {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        background: `linear-gradient(145deg,${lg.bg} 0%,${lg.bg}66 60%,#07090f 100%)`,
        border: `1px solid ${lg.color}28`,
      }}
    >
      {/* Identity row */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{lg.emoji}</span>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.12em', color: lg.color, textTransform: 'uppercase' }}>
            Жумалык рейтинг
          </div>
          <div className="font-black text-base text-white leading-tight">{lg.name} Лигасы</div>
        </div>
        <div
          className="flex-shrink-0 font-black rounded-full px-2.5 py-1"
          style={{ fontSize: 10, background: lg.color + '18', color: lg.color, border: `1px solid ${lg.color}30` }}
        >
          Жогорку 5 → ↑
        </div>
      </div>

      {/* Stats strip */}
      <div
        className="grid grid-cols-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {[
          { v: myRank ? `#${myRank}` : '—',          sub: 'ОРНУМ',    c: '#1CB0F6' },
          { v: (me?.weeklyXP ?? 0).toLocaleString(),  sub: 'ЖУМА XP',  c: '#58CC02' },
          { v: `${daysLeft} күн`,                     sub: 'КАЛДЫ',    c: '#FF9600' },
        ].map(({ v, sub, c }, i) => (
          <div
            key={sub}
            className="py-3 text-center"
            style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
          >
            <div className="font-black text-sm leading-none" style={{ color: c }}>{v}</div>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.1em', color: '#2d3448', marginTop: 3 }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   Top-3 spotlight  (compact 3-column, no animated bars)
══════════════════════════════════════════════════════════════ */
function TopThree({ entries }) {
  const MEDALS = ['🥇', '🥈', '🥉']
  const COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']
  // Display order: 2nd, 1st, 3rd
  const ORDER  = [1, 0, 2]

  return (
    <div
      className="rounded-2xl p-3 mb-4 grid grid-cols-3 gap-2"
      style={{ background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {ORDER.map((idx, pos) => {
        const u = entries[idx]
        const c = COLORS[idx]
        return (
          <motion.div
            key={idx}
            {...fadeUp(pos * 0.06)}
            className="flex flex-col items-center gap-1 py-1"
          >
            {/* Avatar */}
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: idx === 0 ? 48 : 40,
                height: idx === 0 ? 48 : 40,
                fontSize: idx === 0 ? 22 : 18,
                background: 'linear-gradient(145deg,#1a2640,#0d1628)',
                border: `2px solid ${c}`,
                boxShadow: idx === 0 ? `0 0 16px ${c}40` : 'none',
              }}
            >
              {u?.avatar || '👤'}
            </div>

            {/* Medal + name */}
            <div style={{ fontSize: idx === 0 ? 20 : 17 }}>{MEDALS[idx]}</div>
            <div
              className="font-extrabold text-center w-full truncate px-1"
              style={{ fontSize: idx === 0 ? 11 : 10, color: idx === 0 ? '#fff' : '#7a859e' }}
            >
              {u?.name}
            </div>
            <div className="font-black" style={{ fontSize: 10, color: c }}>
              {(u?.weeklyXP || 0).toLocaleString()}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   RankCard  — name = primary, score = visually dominant
══════════════════════════════════════════════════════════════ */
function RankCard({ u, rank, isMe, idx }) {
  const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const ACCENT = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
  const accent = ACCENT[rank] || (isMe ? '#1CB0F6' : null)

  return (
    <motion.div
      {...fadeUp(idx * 0.03)}
      className="flex items-center gap-3 px-3.5 rounded-2xl"
      style={{
        height: 56,
        background: isMe
          ? 'linear-gradient(135deg,rgba(28,176,246,0.07),rgba(28,176,246,0.02))'
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${
          isMe      ? 'rgba(28,176,246,0.22)' :
          rank <= 3 ? (accent + '22')          :
          'rgba(255,255,255,0.05)'
        }`,
        /* Left accent strip via outline workaround */
        borderLeft: `3px solid ${accent || 'transparent'}`,
      }}
    >
      {/* Rank */}
      <div className="w-7 text-center flex-shrink-0">
        {MEDALS[rank]
          ? <span style={{ fontSize: 17 }}>{MEDALS[rank]}</span>
          : <span className="font-black" style={{ fontSize: 11, color: '#2d3448' }}>#{rank}</span>
        }
      </div>

      {/* Avatar */}
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          width: 36, height: 36, fontSize: 17,
          background: 'linear-gradient(145deg,#1a2640,#0d1628)',
          border: `1.5px solid ${accent || 'rgba(255,255,255,0.08)'}`,
        }}
      >
        {u.avatar || '👤'}
      </div>

      {/* Name (PRIMARY FOCUS) + streak */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-black text-[15px] text-white truncate leading-tight">{u.name}</span>
          {isMe && (
            <span
              className="flex-shrink-0 font-black rounded-full"
              style={{ fontSize: 8, padding: '2px 6px', background: 'rgba(28,176,246,0.2)', color: '#1CB0F6' }}
            >
              СЕН
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#FF9600', fontWeight: 700, marginTop: 1 }}>
          🔥 {u.streak || 0} күн
        </div>
      </div>

      {/* Score (VISUALLY DOMINANT) */}
      <div className="text-right flex-shrink-0">
        <div
          className="font-black leading-none"
          style={{
            fontSize: 17,
            color: rank === 1 ? '#FFD700' :
                   rank === 2 ? '#C0C0C0' :
                   rank === 3 ? '#CD7F32' :
                   isMe       ? '#1CB0F6' : '#58CC02',
          }}
        >
          {(u.weeklyXP || 0).toLocaleString()}
        </div>
        <div style={{ fontSize: 8, fontWeight: 900, color: '#2d3448', letterSpacing: '0.1em', marginTop: 2 }}>XP</div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   Zone separator
══════════════════════════════════════════════════════════════ */
function Zone({ color, label }) {
  return (
    <div className="flex items-center gap-2 my-2.5">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${color}30,transparent)` }} />
      <span
        className="font-black uppercase"
        style={{ fontSize: 8, letterSpacing: '0.14em', color, padding: '3px 10px', background: color + '12', border: `1px solid ${color}25`, borderRadius: 99 }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,transparent,${color}30)` }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   Skeleton
══════════════════════════════════════════════════════════════ */
function Skeleton() {
  return (
    <div className="space-y-2">
      {[75, 85, 60, 70, 55, 65, 50].map((w, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3.5 rounded-2xl"
          style={{ height: 56, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="w-7 h-4 rounded animate-pulse flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="w-9 h-9 rounded-full animate-pulse flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', width: `${w}%` }} />
            <div className="h-2 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', width: '35%' }} />
          </div>
          <div className="w-10 h-5 rounded animate-pulse flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   Main
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
    <div className="max-w-[640px] mx-auto px-4 py-4">

      {/* ── League selector ── */}
      <div className="relative mb-4">
        <div
          className="absolute right-0 inset-y-0 w-8 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent,#0e1220)' }}
        />
        <div
          className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5"
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
          <div className="w-4 flex-shrink-0" />
        </div>
      </div>

      {/* ── Content — animates on league switch ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={league}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{   opacity: 0          }}
          transition={{ duration: 0.18 }}
        >
          <LeagueHero lg={lg} myRank={myRank} me={me} daysLeft={daysLeft} />

          {isLoading ? (
            <Skeleton />
          ) : entries.length === 0 ? (
            <div
              className="rounded-2xl py-14 text-center"
              style={{ background: '#0c1018', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{ fontSize: 44, marginBottom: 8 }}>{lg.emoji}</div>
              <div className="font-black text-sm text-white">{lg.name} Лигасы</div>
              <div style={{ fontSize: 12, color: '#2d3448', marginTop: 4 }}>Азырынча оюнчулар жок</div>
            </div>
          ) : (
            <>
              {/* Top 3 spotlight */}
              {entries.length >= 3 && <TopThree entries={entries.slice(0, 3)} />}

              {/* Full rank list */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Header */}
                <div
                  className="px-4 py-2.5 flex items-center gap-2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className="font-extrabold text-sm text-white">Рейтинг</span>
                  <span
                    className="font-black rounded-full px-2 py-0.5"
                    style={{ fontSize: 10, background: 'rgba(255,255,255,0.05)', color: '#2d3448' }}
                  >
                    {entries.length}
                  </span>
                </div>

                <div className="p-2 space-y-1">
                  {/* Top zone */}
                  <Zone color="#58CC02" label="↑ Жогорку зон" />
                  {entries.slice(0, 5).map((e, i) => (
                    <RankCard key={e.id || i} u={e} rank={i + 1} isMe={e.id === me?.id} idx={i} />
                  ))}

                  {/* Middle zone */}
                  {entries.length > 5 && (
                    <>
                      <Zone color="#7a859e" label="↔ Ортоңку зон" />
                      {entries.slice(5, 8).map((e, i) => (
                        <RankCard key={e.id || i} u={e} rank={i + 6} isMe={e.id === me?.id} idx={i + 5} />
                      ))}
                    </>
                  )}

                  {/* Bottom zone */}
                  {entries.length > 8 && (
                    <>
                      <Zone color="#FF4B4B" label="↓ Астынкы зон" />
                      {entries.slice(8).map((e, i) => (
                        <RankCard key={e.id || i} u={e} rank={i + 9} isMe={e.id === me?.id} idx={i + 8} />
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
