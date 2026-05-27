import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { audio } from '@/lib/audio'

/* ── Constants ───────────────────────────────────────────────── */
const STRIPE = {
  backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
  backgroundSize: '14px 14px',
}

const CATS = [
  { id: 'all',     label: 'Баары',   emoji: '✨', color: '#1CB0F6' },
  { id: 'hearts',  label: 'Жандар',  emoji: '❤️', color: '#FF4B4B' },
  { id: 'boosts',  label: 'Boost',   emoji: '⚡', color: '#FF9600' },
  { id: 'streaks', label: 'Streak',  emoji: '🔥', color: '#FF6B35' },
  { id: 'avatars', label: 'Аватар',  emoji: '🎭', color: '#A855F7' },
]

/* ── Main page ───────────────────────────────────────────────── */
export default function Shop() {
  const user    = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)
  const [cat, setCat]           = useState('all')
  const [selected, setSelected] = useState(null)
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
    <div className="max-w-[640px] mx-auto px-4 py-5">

      {/* ── Hero card ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl mb-6"
        style={{
          background: 'linear-gradient(135deg,#0d1829 0%,#080e1c 100%)',
          border: '1px solid rgba(28,176,246,0.22)',
          boxShadow: '0 0 60px rgba(28,176,246,0.07)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.025]" style={STRIPE} />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-[0.18]"
          style={{ background: 'radial-gradient(circle,#1CB0F6 0%,transparent 70%)' }} />

        <div className="relative p-5">
          {/* Gems balance */}
          <div className="flex items-center gap-4 pb-4 mb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

            <motion.div
              animate={{
                boxShadow: [
                  '0 0 16px rgba(28,176,246,0.25)',
                  '0 0 36px rgba(28,176,246,0.55)',
                  '0 0 16px rgba(28,176,246,0.25)',
                ],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(28,176,246,0.18),rgba(14,140,207,0.08))' }}
            >
              💎
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="text-[0.58rem] font-black tracking-[3px] uppercase mb-1" style={{ color: '#1CB0F6' }}>
                GEM БАЛАНС
              </div>
              <motion.div
                key={user?.gems}
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="text-3xl font-black text-white leading-none"
              >
                {(user?.gems || 0).toLocaleString()}
              </motion.div>
              <div className="text-[0.6rem] font-semibold mt-1" style={{ color: '#3d4860' }}>
                Сабактарды аяктоо аркылуу топто
              </div>
            </div>

            {/* Gem pip indicators */}
            <div className="flex flex-col gap-1 items-center flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1.5 h-4 rounded-full transition-all duration-500"
                  style={{
                    background: i < Math.min(5, Math.floor((user?.gems || 0) / 100))
                      ? 'linear-gradient(180deg,#1CB0F6,#0e8ccf)'
                      : 'rgba(255,255,255,0.07)',
                  }} />
              ))}
            </div>
          </div>

          {/* Daily reward */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -8, 8, -5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 3.5 }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'rgba(255,217,0,0.1)', border: '1px solid rgba(255,217,0,0.18)' }}
            >
              🎁
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm text-white">Күндөлүк Сыйлык</div>
              <div className="text-[0.62rem] font-semibold mt-0.5" style={{ color: '#4d5870' }}>
                Бүгүн аракет кылып +50 💎 ал!
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => dailyMut.mutate()}
              disabled={dailyMut.isPending}
              className="flex-shrink-0 px-5 py-2.5 font-black text-xs rounded-2xl transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg,#FFD900,#FF9600)',
                color: '#0a0d18',
                boxShadow: '0 4px 20px rgba(255,217,0,0.35)',
              }}
            >
              {dailyMut.isPending ? '...' : 'АЛ'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Category tabs ── */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
        {CATS.map(c => {
          const active = cat === c.id
          return (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => setCat(c.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-extrabold text-xs border transition-all duration-200 whitespace-nowrap"
              style={active ? {
                background: c.color + '20',
                borderColor: c.color + '50',
                color: c.color,
                boxShadow: `0 0 16px ${c.color}20`,
              } : {
                background: '#0c1018',
                borderColor: 'rgba(255,255,255,0.07)',
                color: '#3d4860',
              }}
            >
              <span className="text-sm leading-none">{c.emoji}</span>
              {c.label}
            </motion.button>
          )
        })}
      </div>

      {/* ── Items grid ── */}
      {isLoading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🛒</div>
          <div className="font-extrabold text-sm" style={{ color: '#3d4860' }}>
            Бул категорияда буюм жок
          </div>
        </div>
      ) : (
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {filtered.map((item, i) => {
            const isOwned   = owned.includes(item.id)
            const canAfford = (user?.gems || 0) >= item.price
            const catData   = CATS.find(c => c.id === item.category) || CATS[0]
            return (
              <ItemCard
                key={item.id}
                item={item}
                index={i}
                isOwned={isOwned}
                canAfford={canAfford}
                catData={catData}
                onClick={() => !isOwned && setSelected(item)}
              />
            )
          })}
        </motion.div>
      )}

      {/* ── Purchase modal ── */}
      <AnimatePresence>
        {selected && (
          <PurchaseModal
            item={selected}
            user={user}
            isPending={buyMut.isPending}
            onBuy={() => buyMut.mutate(selected.id)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Item Card ───────────────────────────────────────────────── */
function ItemCard({ item, index, isOwned, canAfford, catData, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={!isOwned ? { y: -4 } : {}}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden border cursor-pointer select-none"
      style={{
        background: isOwned
          ? 'linear-gradient(135deg,rgba(88,204,2,0.06),rgba(0,0,0,0))'
          : 'linear-gradient(135deg,#0d1220,#08101c)',
        borderColor: isOwned
          ? 'rgba(88,204,2,0.28)'
          : canAfford
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(255,255,255,0.04)',
        boxShadow: isOwned
          ? '0 4px 24px rgba(88,204,2,0.06)'
          : 'none',
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
      }}
    >
      {/* Top accent bar */}
      <div className="h-[2px] w-full" style={{
        background: isOwned
          ? 'linear-gradient(90deg,#58CC02,transparent)'
          : `linear-gradient(90deg,${catData.color},transparent)`,
        opacity: isOwned ? 0.7 : 0.35,
      }} />

      {/* Owned checkmark badge */}
      {isOwned && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(88,204,2,0.14)', border: '1px solid rgba(88,204,2,0.3)' }}>
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="#58CC02" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <div className="p-4 text-center">
        {/* Icon with subtle pulse for affordable items */}
        <motion.div
          animate={!isOwned && canAfford ? { scale: [1, 1.07, 1] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3 }}
          className="text-4xl mb-2.5 leading-none"
        >
          {item.icon}
        </motion.div>

        <div className="font-black text-xs sm:text-sm leading-tight mb-1.5 text-white">
          {item.name}
        </div>
        <div className="text-[0.6rem] font-semibold leading-snug mb-3" style={{ color: '#3d4860' }}>
          {item.description}
        </div>

        {/* Price / status */}
        {isOwned ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.62rem] font-black"
            style={{ background: 'rgba(88,204,2,0.1)', color: '#58CC02', border: '1px solid rgba(88,204,2,0.22)' }}>
            ✓ Бар
          </div>
        ) : item.price === 0 ? (
          <div className="inline-flex px-3 py-1.5 rounded-full text-[0.62rem] font-black"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#3d4860', border: '1px solid rgba(255,255,255,0.06)' }}>
            Бекер
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.62rem] font-black"
            style={{
              background:   canAfford ? catData.color + '18' : 'rgba(255,255,255,0.04)',
              color:        canAfford ? catData.color : '#2d3448',
              border:       `1px solid ${canAfford ? catData.color + '38' : 'rgba(255,255,255,0.05)'}`,
            }}>
            💎 {item.price}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Purchase Modal ──────────────────────────────────────────── */
function PurchaseModal({ item, user, isPending, onBuy, onClose }) {
  const canAfford = (user?.gems || 0) >= item.price
  const catData   = CATS.find(c => c.id === item.category) || CATS[0]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[500] flex items-end sm:items-center justify-center sm:p-5"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0.6 }}
        animate={{ y: 0,      opacity: 1   }}
        exit={{   y: '100%', opacity: 0   }}
        transition={{ type: 'spring', stiffness: 420, damping: 40 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full sm:max-w-sm overflow-hidden rounded-t-[28px] sm:rounded-[28px]"
        style={{
          background: '#0c1018',
          border: `1px solid ${catData.color}28`,
          paddingBottom: `max(1.5rem, env(safe-area-inset-bottom))`,
          boxShadow: `0 -20px 60px ${catData.color}12`,
        }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg,transparent 5%,${catData.color}80 50%,transparent 95%)` }} />

        {/* Ambient glow orb */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-3xl pointer-events-none"
          style={{ background: catData.color, opacity: 0.08 }} />

        {/* Drag handle (mobile) */}
        <div className="w-10 h-1 rounded-full mx-auto mt-4 mb-1 sm:hidden"
          style={{ background: 'rgba(255,255,255,0.12)' }} />

        <div className="relative px-6 pt-3 pb-2 text-center">

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.05 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl mb-4"
            style={{
              background: `linear-gradient(135deg,${catData.color}1a,${catData.color}08)`,
              border: `1px solid ${catData.color}2a`,
              boxShadow: `0 10px 40px ${catData.color}22`,
            }}
          >
            {item.icon}
          </motion.div>

          {/* Category chip */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.58rem] font-black mb-3"
            style={{ background: catData.color + '15', color: catData.color, border: `1px solid ${catData.color}28` }}>
            {catData.emoji} {catData.label}
          </div>

          <h2 className="text-xl font-black text-white mb-1.5">{item.name}</h2>
          <p className="text-sm font-semibold leading-relaxed mb-5" style={{ color: '#4d5870' }}>
            {item.description}
          </p>

          {/* Price vs Balance */}
          <div className="flex items-center gap-4 justify-center mb-5 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-center">
              <div className="text-[0.55rem] font-black tracking-[2px] uppercase mb-1" style={{ color: '#2d3448' }}>БААСЫ</div>
              <div className="text-xl font-black" style={{ color: canAfford ? '#1CB0F6' : '#FF4B4B' }}>
                💎 {item.price}
              </div>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <div className="text-center">
              <div className="text-[0.55rem] font-black tracking-[2px] uppercase mb-1" style={{ color: '#2d3448' }}>БАЛАНС</div>
              <div className="text-xl font-black" style={{ color: canAfford ? '#58CC02' : '#FF4B4B' }}>
                💎 {(user?.gems || 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Buy button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onBuy}
            disabled={isPending || !canAfford}
            className="w-full py-4 rounded-2xl font-black text-sm tracking-wide text-white mb-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={canAfford ? {
              background: 'linear-gradient(135deg,#58CC02,#3ea800)',
              boxShadow: '0 6px 28px rgba(88,204,2,0.38)',
            } : {
              background: 'rgba(255,255,255,0.05)',
              color: '#2d3448',
            }}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                </svg>
                Сатылууда...
              </span>
            ) : !canAfford
              ? '💎 Gem жетишсиз'
              : `САТЫП АЛ — 💎 ${item.price}`
            }
          </motion.button>

          {/* Cancel */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-extrabold text-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#3d4860', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            ЖОККО ЧЫГАРУУ
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Skeleton loader ─────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-white/[0.04]"
          style={{ background: '#0d1220', height: 176 }}>
          <div className="h-[2px] w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="p-4 flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="w-20 h-2.5 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="w-14 h-2 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            <div className="w-16 h-6 rounded-full animate-pulse mt-1" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
