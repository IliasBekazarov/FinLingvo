import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { audio } from '@/lib/audio'

const CATS = [
  { id: 'all',     label: 'Баары' },
  { id: 'hearts',  label: '❤️ Жандар' },
  { id: 'boosts',  label: '⚡ Boost' },
  { id: 'streaks', label: '🔥 Streak' },
  { id: 'avatars', label: '🎭 Аватар' },
]

/* Stripe texture identical to Learn/Leaderboard */
const STRIPE = {
  backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
  backgroundSize: '14px 14px',
}

export default function Shop() {
  const user    = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)
  const [cat, setCat]           = useState('all')
  const [selected, setSelected] = useState(null)
  const qc = useQueryClient()

  const { data: items = [] } = useQuery({
    queryKey: ['shop'],
    queryFn: () => api.get('/shop'),
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

      {/* ── Hero card (gems + daily reward) ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 sm:p-5 mb-5 relative overflow-hidden border"
        style={{
          background: 'linear-gradient(135deg, rgba(28,176,246,0.12) 0%, rgba(14,140,207,0.06) 60%, #0a0d18 100%)',
          borderColor: 'rgba(28,176,246,0.28)',
          boxShadow: '0 0 36px rgba(28,176,246,0.14)',
        }}
      >
        {/* Stripe texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={STRIPE} />

        {/* Gems balance */}
        <div className="relative flex items-center gap-3 sm:gap-4 pb-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: 'rgba(28,176,246,0.14)', boxShadow: '0 0 22px rgba(28,176,246,0.3)' }}
          >
            💎
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[0.6rem] font-black tracking-[3px] uppercase mb-0.5"
              style={{ color: '#1CB0F6' }}>
              GEM БАЛАНС
            </div>
            <div className="text-2xl sm:text-3xl font-black gradient-text-blue leading-none">
              {(user?.gems || 0).toLocaleString()}
            </div>
          </div>
          <div className="hidden sm:block text-right text-xs text-t3 font-semibold leading-relaxed flex-shrink-0">
            Сабактарды аяктоо<br/>аркылуу gems ал
          </div>
        </div>

        {/* Daily reward */}
        <div className="relative flex items-center gap-3 pt-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(255,217,0,0.12)' }}>
            🎁
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-sm">Күндөлүк Сыйлык</div>
            <div className="text-t2 text-xs font-semibold mt-0.5">Бүгүн үйрөнүп, +50 💎 ал!</div>
          </div>
          <button
            onClick={() => dailyMut.mutate()}
            disabled={dailyMut.isPending}
            className="flex-shrink-0 px-4 py-2 font-black text-sm rounded-xl transition-all active:scale-95 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg,#FFD900,#FF9600)',
              color: '#0a0d18',
              boxShadow: '0 4px 16px rgba(255,217,0,0.3)',
            }}
          >
            {dailyMut.isPending ? '...' : 'АЛ'}
          </button>
        </div>
      </motion.div>

      {/* ── Category tabs ── */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
        {CATS.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full font-extrabold text-xs border-[1.5px] transition-all whitespace-nowrap active:scale-95 ${
              cat === c.id
                ? 'border-blue text-white'
                : 'border-soft2 text-t2 hover:text-white hover:border-white/20'
            }`}
            style={cat === c.id ? { background: 'rgba(28,176,246,0.18)' } : { background: '#131826' }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Items grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map((item, i) => {
          const isOwned   = owned.includes(item.id)
          const canAfford = (user?.gems || 0) >= item.price

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => !isOwned && setSelected(item)}
              className="bg-card border border-soft rounded-2xl overflow-hidden transition-all cursor-pointer select-none hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                borderColor: isOwned ? 'rgba(88,204,2,0.3)' : 'rgba(255,255,255,0.06)',
              }}
              whileHover={!isOwned ? { borderColor: 'rgba(28,176,246,0.35)' } : {}}
            >
              <div className="p-4 text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="font-extrabold text-xs sm:text-sm mb-1 leading-tight">{item.name}</div>
                <div className="text-t2 text-[0.62rem] mb-3 leading-snug">{item.description}</div>
              </div>
              <div className="px-3 pb-3">
                {isOwned ? (
                  <div className="w-full py-1.5 rounded-xl text-xs font-extrabold text-center"
                    style={{ background: 'rgba(88,204,2,0.1)', color: '#58CC02', border: '1px solid rgba(88,204,2,0.25)' }}>
                    ✓ Бар
                  </div>
                ) : item.price === 0 ? (
                  <div className="w-full py-1.5 rounded-xl text-xs font-extrabold text-center"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#7a859e', border: '1px solid rgba(255,255,255,0.06)' }}>
                    Бекер
                  </div>
                ) : (
                  <div className="w-full py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5"
                    style={{
                      background: canAfford ? 'rgba(28,176,246,0.12)' : 'rgba(255,255,255,0.04)',
                      color: canAfford ? '#1CB0F6' : '#3d4860',
                      border: `1px solid ${canAfford ? 'rgba(28,176,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                    💎 {item.price}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Purchase modal (slides up from bottom) ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[500] flex items-end sm:items-center justify-center sm:p-5"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 38 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-soft2 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm text-center overflow-hidden"
              style={{ paddingBottom: `max(1.5rem, env(safe-area-inset-bottom))` }}
            >
              {/* Drag handle */}
              <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mt-4 mb-5 sm:hidden" />

              <div className="px-7 pb-2">
                <div className="text-5xl mb-3">{selected.icon}</div>
                <h2 className="text-xl font-black mb-1">{selected.name}</h2>
                <p className="text-t2 text-sm font-semibold mb-4">{selected.description}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-extrabold text-sm mb-5"
                  style={{ background: 'rgba(28,176,246,0.12)', border: '1px solid rgba(28,176,246,0.3)', color: '#1CB0F6' }}>
                  💎 {selected.price} Gem
                </div>
                <button
                  onClick={() => buyMut.mutate(selected.id)}
                  disabled={buyMut.isPending || (user?.gems || 0) < selected.price}
                  className="w-full py-3.5 rounded-2xl font-black text-sm tracking-wider text-white mb-2.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#58CC02', boxShadow: '0 4px 20px rgba(88,204,2,0.35)' }}
                >
                  {buyMut.isPending ? '...' : (user?.gems || 0) < selected.price ? '💎 Gem жетишсиз' : `САТЫП АЛ — 💎 ${selected.price}`}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="w-full py-3 rounded-2xl font-extrabold text-sm transition-all active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', color: '#7a859e' }}
                >
                  ЖОККО ЧЫГАРУУ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
