/**
 * Shop — mobile-first, story-based, premium
 * ∙ Vertical card layout, one column on mobile
 * ∙ Price visually dominant, sticky bottom CTA
 * ∙ No hover interactions — tap only
 * ∙ Minimal, meaningful animations only
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { audio } from '@/lib/audio'

/* ── Category config ─────────────────────────────────────────── */
const CATS = [
  { id: 'all',     label: 'Баары',  emoji: '✨', color: '#1CB0F6' },
  { id: 'hearts',  label: 'Жандар', emoji: '❤️', color: '#FF4B4B' },
  { id: 'boosts',  label: 'Boost',  emoji: '⚡', color: '#FF9600' },
  { id: 'streaks', label: 'Streak', emoji: '🔥', color: '#FF6B35' },
  { id: 'avatars', label: 'Аватар', emoji: '🎭', color: '#A855F7' },
]

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 8 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.2, delay },
})

/* ══════════════════════════════════════════════════════════════
   Main
══════════════════════════════════════════════════════════════ */
export default function Shop() {
  const user    = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)
  const [cat, setCat]           = useState('all')
  const [selected, setSelected] = useState(null)   // sticky bottom CTA
  const qc = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['shop'],
    queryFn:  () => api.get('/shop'),
  })

  const buyMut = useMutation({
    mutationFn: (itemId) => api.post('/shop/buy', { itemId }),
    onSuccess: ({ user: u, item }) => {
      setUser(u)
      setSelected(null)
      audio.levelup()
      toast.success(`${item.icon} ${item.name} алынды!`)
      qc.invalidateQueries(['shop'])
    },
    onError: (e) => toast.error(e.message),
  })

  const dailyMut = useMutation({
    mutationFn: () => api.post('/shop/daily'),
    onSuccess: ({ gems, earned }) => {
      setUser({ ...user, gems })
      audio.complete()
      toast.success(`🎁 +${earned} 💎 алдың!`)
    },
    onError: (e) => toast.error(e.message),
  })

  const filtered = cat === 'all' ? items : items.filter(i => i.category === cat)
  const owned    = user?.inventory?.map(i => i.itemId) || []

  return (
    <>
      <div className="max-w-[640px] mx-auto px-4 py-4">

        {/* ══ GEM BALANCE STRIP ══════════════════════════════════ */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-4 px-4 py-3 rounded-2xl"
          style={{ background: '#0c1018', border: '1px solid rgba(28,176,246,0.15)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(28,176,246,0.12)' }}>
            💎
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.12em', color: '#1CB0F6', textTransform: 'uppercase' }}>
              Gem Баланс
            </div>
            <div className="font-black text-xl text-white leading-tight">
              {(user?.gems || 0).toLocaleString()}
            </div>
          </div>
          {/* Daily reward */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => dailyMut.mutate()}
            disabled={dailyMut.isPending}
            className="flex items-center gap-2 flex-shrink-0 px-3.5 py-2 rounded-xl font-black text-xs disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#FFD900,#FF9600)', color: '#0a0d18', boxShadow: '0 4px 16px rgba(255,217,0,0.28)' }}
          >
            🎁 {dailyMut.isPending ? '...' : '+50'}
          </motion.button>
        </motion.div>

        {/* ══ CATEGORY CHIPS ═════════════════════════════════════ */}
        <div className="relative mb-4">
          <div
            className="absolute right-0 inset-y-0 w-8 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg,transparent,#0e1220)' }}
          />
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5" style={{ WebkitOverflowScrolling: 'touch' }}>
            {CATS.map(c => {
              const active = cat === c.id
              return (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setCat(c.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 rounded-xl font-extrabold text-xs border whitespace-nowrap"
                  style={{
                    height: 40,
                    padding: '0 14px',
                    background:   active ? c.color + '18' : '#0c1018',
                    borderColor:  active ? c.color + '45' : 'rgba(255,255,255,0.07)',
                    color:        active ? c.color         : '#2d3448',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{c.emoji}</span>
                  {c.label}
                </motion.button>
              )
            })}
            <div className="w-4 flex-shrink-0" />
          </div>
        </div>

        {/* ══ PRODUCT LIST ═══════════════════════════════════════ */}
        {isLoading ? (
          <SkeletonList />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl py-14 text-center" style={{ background: '#0c1018', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
            <div className="font-black text-sm text-white">Буюм жок</div>
          </div>
        ) : (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-2"
          >
            {filtered.map((item, i) => {
              const isOwned   = owned.includes(item.id)
              const canAfford = (user?.gems || 0) >= item.price
              const catData   = CATS.find(c => c.id === item.category) || CATS[0]
              const isSelected = selected?.id === item.id

              return (
                <ProductCard
                  key={item.id}
                  item={item}
                  index={i}
                  isOwned={isOwned}
                  canAfford={canAfford}
                  catData={catData}
                  isSelected={isSelected}
                  onSelect={() => !isOwned && setSelected(isSelected ? null : item)}
                />
              )
            })}
          </motion.div>
        )}

        {/* Bottom spacer — accounts for sticky bar + MobileNav */}
        <div className="h-32 md:h-8" />
      </div>

      {/* ══ STICKY BOTTOM CTA ══════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <StickyBuyBar
            item={selected}
            user={user}
            isPending={buyMut.isPending}
            onBuy={() => buyMut.mutate(selected.id)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   ProductCard  — horizontal layout, price dominant
══════════════════════════════════════════════════════════════ */
function ProductCard({ item, index, isOwned, canAfford, catData, isSelected, onSelect }) {
  return (
    <motion.div
      {...fadeUp(index * 0.04)}
      whileTap={!isOwned ? { scale: 0.985 } : {}}
      onClick={onSelect}
      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl cursor-pointer select-none"
      style={{
        background: isSelected
          ? catData.color + '0f'
          : isOwned
            ? 'rgba(88,204,2,0.04)'
            : '#0c1018',
        border: `1px solid ${
          isSelected ? catData.color + '40' :
          isOwned    ? 'rgba(88,204,2,0.22)' :
          'rgba(255,255,255,0.06)'
        }`,
        borderLeft: `3px solid ${
          isSelected ? catData.color :
          isOwned    ? '#58CC02'     :
          'transparent'
        }`,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{
          width: 48, height: 48, fontSize: 24,
          background: isOwned ? 'rgba(88,204,2,0.1)' : catData.color + '14',
        }}
      >
        {item.icon}
      </div>

      {/* Info — name is PRIMARY FOCUS */}
      <div className="flex-1 min-w-0">
        <div className="font-black text-[14px] text-white leading-tight truncate">{item.name}</div>
        <div className="mt-0.5 leading-tight" style={{ fontSize: 11, color: '#4d5870' }}>{item.description}</div>
        {isOwned && (
          <div className="mt-1 font-black" style={{ fontSize: 10, color: '#58CC02' }}>✓ Сатып алынган</div>
        )}
      </div>

      {/* Price (VISUALLY DOMINANT) + action */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
        {isOwned ? (
          <div
            className="font-black px-2.5 py-1.5 rounded-xl"
            style={{ fontSize: 11, background: 'rgba(88,204,2,0.1)', color: '#58CC02', border: '1px solid rgba(88,204,2,0.2)' }}
          >
            ✓ Бар
          </div>
        ) : item.price === 0 ? (
          <div className="font-black" style={{ fontSize: 14, color: '#58CC02' }}>Бекер</div>
        ) : (
          <>
            {/* DOMINANT price */}
            <div
              className="font-black leading-none"
              style={{ fontSize: 16, color: canAfford ? catData.color : '#FF4B4B' }}
            >
              💎 {item.price}
            </div>
            {/* CTA chip */}
            <motion.div
              whileTap={{ scale: 0.92 }}
              className="font-black text-center rounded-xl"
              style={{
                fontSize: 11,
                padding: '6px 14px',
                background: isSelected
                  ? catData.color
                  : canAfford
                    ? catData.color + '22'
                    : 'rgba(255,255,255,0.05)',
                color: isSelected
                  ? '#fff'
                  : canAfford
                    ? catData.color
                    : '#2d3448',
                border: `1px solid ${isSelected ? catData.color : canAfford ? catData.color + '40' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {isSelected ? '✓ ТАНДАЛДЫ' : 'АЛ'}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   StickyBuyBar  — slides up from bottom, covers MobileNav
══════════════════════════════════════════════════════════════ */
function StickyBuyBar({ item, user, isPending, onBuy, onClose }) {
  const canAfford = (user?.gems || 0) >= item.price
  const catData   = CATS.find(c => c.id === item.category) || CATS[0]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[300]"
      />

      {/* Bar */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 460, damping: 44 }}
        className="fixed bottom-0 left-0 right-0 z-[400]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div
          className="mx-3 mb-3 rounded-3xl overflow-hidden"
          style={{
            background: '#0d1220',
            border: `1px solid ${catData.color}30`,
            boxShadow: `0 -12px 40px rgba(0,0,0,0.6), 0 -2px 0 ${catData.color}20`,
          }}
        >
          {/* Top accent */}
          <div className="h-[2px]" style={{ background: `linear-gradient(90deg,transparent 10%,${catData.color}60 50%,transparent 90%)` }} />

          {/* Product row */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: catData.color + '15' }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm text-white truncate">{item.name}</div>
              <div style={{ fontSize: 11, color: '#4d5870', marginTop: 2 }}>{item.description}</div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#3d4860', fontSize: 16 }}
            >
              ×
            </button>
          </div>

          {/* Balance + CTA row */}
          <div className="flex items-center gap-2.5 px-4 pb-4">
            <div
              className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div>
                <div style={{ fontSize: 8, fontWeight: 900, color: '#2d3448', letterSpacing: '0.1em' }}>БАЛАНС</div>
                <div className="font-black text-sm" style={{ color: canAfford ? '#58CC02' : '#FF4B4B' }}>
                  💎 {(user?.gems || 0).toLocaleString()}
                </div>
              </div>
              <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <div>
                <div style={{ fontSize: 8, fontWeight: 900, color: '#2d3448', letterSpacing: '0.1em' }}>БААСЫ</div>
                <div className="font-black text-sm" style={{ color: catData.color }}>
                  💎 {item.price}
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onBuy}
              disabled={isPending || !canAfford}
              className="font-black text-sm rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                padding: '12px 22px',
                background: canAfford
                  ? 'linear-gradient(135deg,#58CC02,#3ea800)'
                  : 'rgba(255,255,255,0.06)',
                color: canAfford ? '#fff' : '#2d3448',
                boxShadow: canAfford ? '0 6px 24px rgba(88,204,2,0.38)' : 'none',
                flexShrink: 0,
              }}
            >
              {isPending ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                </svg>
              ) : !canAfford ? 'Жетишсиз' : 'САТЫП АЛ'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   Skeleton list
══════════════════════════════════════════════════════════════ */
function SkeletonList() {
  return (
    <div className="space-y-2">
      {[70, 85, 60, 75, 55, 80].map((w, i) => (
        <div
          key={i}
          className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl"
          style={{ background: '#0c1018', border: '1px solid rgba(255,255,255,0.06)', height: 76 }}
        >
          <div className="w-12 h-12 rounded-xl animate-pulse flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', width: `${w}%` }} />
            <div className="h-2.5 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', width: '50%' }} />
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="w-12 h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="w-14 h-7 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
