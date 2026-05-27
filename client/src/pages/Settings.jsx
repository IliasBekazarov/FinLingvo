import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { LEAGUES } from '@/data/content'

/* Stripe texture identical to Learn/Leaderboard */
const STRIPE = {
  backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
  backgroundSize: '14px 14px',
}

function levelOf(xp) { return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1) }

export default function Settings() {
  const user    = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)
  const logout  = useAuthStore(s => s.logout)
  const navigate = useNavigate()
  const settings = user?.settings || {}

  const [name, setName]         = useState(user?.name || '')
  const [editName, setEditName] = useState(false)
  const [goal, setGoal]         = useState(settings.dailyGoal || 10)

  const lvl    = levelOf(user?.xp || 0)
  const prevXP = Math.pow(lvl - 1, 2) * 100
  const nextXP = Math.pow(lvl, 2) * 100
  const pct    = Math.min(100, Math.round(((user?.xp - prevXP) / (nextXP - prevXP)) * 100)) || 0
  const league = LEAGUES?.find(l => l.id === user?.league) || LEAGUES?.[0]

  async function saveSetting(key, val) {
    try {
      const s       = { ...settings, [key]: val }
      const updated = await api.patch('/users/me', { settings: s })
      setUser(updated)
    } catch (e) { toast.error(e.message) }
  }

  async function saveNameFn() {
    if (!name.trim()) { toast.error('Ат бош болуп калды!'); return }
    try {
      const updated = await api.patch('/users/me', { name: name.trim() })
      setUser(updated)
      setEditName(false)
      toast.success('Аты өзгөрттүрүлдү ✓')
    } catch (e) { toast.error(e.message) }
  }

  async function resetProgress() {
    if (!confirm('Чынбы? Бардык прогрессиңиз жоголот!')) return
    try {
      await api.patch('/users/me', { xp: 0, gems: 130, streak: 0 })
      setUser({ ...user, xp: 0, gems: 130, streak: 0, weeklyXP: 0, progress: [], achievements: [] })
      toast('Прогресс тазаланды', { icon: '⚠️' })
      navigate('/learn')
    } catch {}
  }

  const completedLessons = (user?.progress || []).length

  return (
    <div className="max-w-[640px] mx-auto px-4 py-5 space-y-4">

      {/* ── User hero card ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 sm:p-5 relative overflow-hidden border"
        style={{
          background: 'linear-gradient(135deg, rgba(28,176,246,0.1) 0%, rgba(14,140,207,0.05) 60%, #0a0d18 100%)',
          borderColor: 'rgba(28,176,246,0.22)',
          boxShadow: '0 0 28px rgba(28,176,246,0.1)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.03]" style={STRIPE} />
        <div className="relative flex items-center gap-3 sm:gap-4">
          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#162240,#0b1628)',
              border: '2px solid rgba(28,176,246,0.35)',
              boxShadow: '0 0 18px rgba(28,176,246,0.2)',
            }}
          >
            {user?.avatar || '🦅'}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="font-black text-base sm:text-lg truncate">{user?.name}</div>
            <div className="text-t2 text-xs font-semibold mt-0.5">
              {league?.emoji} {league?.name} · Деңгээл {lvl}
            </div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: '#1CB0F6' }}
              />
            </div>
          </div>
          {/* XP badge */}
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-black gradient-text-gold">{(user?.xp||0).toLocaleString()}</div>
            <div className="text-[0.6rem] font-extrabold tracking-wider" style={{ color: '#3d4860' }}>XP</div>
          </div>
        </div>
      </motion.div>

      {/* ── Profile section ── */}
      <Section title="ПРОФИЛЬ" delay={0.05}>
        {editName ? (
          <div className="px-4 py-3 border-t border-soft space-y-2">
            <div className="font-bold text-sm">Атыңыз</div>
            <div className="flex gap-2">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveNameFn()}
                autoFocus
                className="flex-1 min-w-0 bg-card2 border border-soft rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-blue transition-all"
              />
              <button onClick={saveNameFn}
                className="px-3 py-2 text-white text-xs font-extrabold rounded-xl transition-all active:scale-95 flex-shrink-0"
                style={{ background: '#58CC02' }}>
                Сакта
              </button>
              <button onClick={() => setEditName(false)}
                className="w-9 h-9 bg-card2 text-t2 text-xs font-extrabold rounded-xl border border-soft transition-all flex items-center justify-center flex-shrink-0">
                ✕
              </button>
            </div>
          </div>
        ) : (
          <Row label="Атыңыз" sub={user?.name}>
            <ChipBtn onClick={() => setEditName(true)}>Өзгөртүү</ChipBtn>
          </Row>
        )}
        <Row label="Email" sub={user?.email || '—'}>
          <span className="text-t3 text-sm">🔒</span>
        </Row>
        <Row label="Аватар" sub={`${user?.avatar || '🦅'} Демейки`}>
          <ChipBtn onClick={() => navigate('/shop')}>Дүкөн</ChipBtn>
        </Row>
      </Section>

      {/* ── Daily goal ── */}
      <Section title="КҮНДӨЛҮК МАКСАТ" delay={0.08}>
        <div className="p-3">
          <p className="text-t2 text-xs font-semibold mb-3">Күн сайын канча XP жыйнагыңыз келет?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { val: 5,  icon: '🐢', label: 'Минималдуу' },
              { val: 10, icon: '🐇', label: 'Жөнөкөй' },
              { val: 20, icon: '🦅', label: 'Сунушталат' },
              { val: 50, icon: '🚀', label: 'Интенсив' },
            ].map(g => (
              <button
                key={g.val}
                onClick={() => { setGoal(g.val); saveSetting('dailyGoal', g.val) }}
                className="py-3 rounded-xl border-2 text-center transition-all font-extrabold text-xs active:scale-95"
                style={{
                  borderColor: goal === g.val ? '#1CB0F6' : 'rgba(255,255,255,0.06)',
                  background:  goal === g.val ? 'rgba(28,176,246,0.1)' : '#1a2133',
                  color:       goal === g.val ? '#fff' : '#7a859e',
                }}
              >
                <div className="text-xl mb-1">{g.icon}</div>
                <div className="font-black">{g.val} XP</div>
                <div className="text-[0.6rem] text-t3 mt-0.5">{g.label}</div>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Audio & Notifications ── */}
      <Section title="АУДИО ЖАНА БИЛДИРҮҮ" delay={0.11}>
        <ToggleRow label="🔊 Тыбыш эффекттери"   sub="Туура/туура эмес тыбыштар"    checked={settings.sound !== false}         onChange={v => saveSetting('sound', v)} />
        <ToggleRow label="🔔 Билдирүүлөр"         sub="Күндөлүк эскертме"            checked={settings.notifications !== false} onChange={v => saveSetting('notifications', v)} />
        <ToggleRow label="🎉 Анимациялар"          sub="Конфетти жана эффекттер"      checked={settings.animations !== false}    onChange={v => saveSetting('animations', v)} />
      </Section>

      {/* ── Learning ── */}
      <Section title="ОКУУ ЖӨНДӨМДӨРҮ" delay={0.14}>
        <ToggleRow label="💡 Жардам кнопкасы"  sub="Суроолордо жардам берет"    checked={settings.hints !== false} onChange={v => saveSetting('hints', v)} />
        <ToggleRow label="⏱️ Убакыт чектөөсү"  sub="Суроолорго убакыт берилет"  checked={!!settings.timer}         onChange={v => saveSetting('timer', v)} />
      </Section>

      {/* ── Stats ── */}
      <Section title="СТАТИСТИКА" delay={0.17}>
        <StatRow label="📊 Жалпы XP"          val={(user?.xp||0).toLocaleString()}        cls="gradient-text-green" />
        <StatRow label="✅ Аяктаган сабактар"  val={completedLessons}                       cls="text-blue" />
        <StatRow label="🏅 Жетишкендиктер"    val={(user?.achievements||[]).length}         cls="text-yellow" />
        <StatRow label="📅 Каттоо датасы"     val={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '—'} />
      </Section>

      {/* ── Danger zone ── */}
      <Section title="КОРКУНУЧТУУ ЗОН" titleColor="#FF4B4B" delay={0.2}>
        <DangerRow label="🔄 Прогрессти тазалоо" sub="Бардык прогресс жоголот!"           onClick={resetProgress} />
        <DangerRow label="🚪 Чыгуу"             sub="Аккаунттан чыгуу" onClick={() => { if (confirm('Чыккыңыз келеби?')) { logout(); navigate('/') } }} />
      </Section>

      <div className="text-center py-4 text-t3 text-xs font-semibold leading-loose">
        🦅 FinLingvo v2.0<br />
        Финансылык сабаттуулук платформасы<br />
        <span className="text-blue">Made with ❤️ in Kyrgyzstan</span>
      </div>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────── */

function Section({ title, children, delay = 0, titleColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-soft rounded-2xl overflow-hidden"
    >
      <div
        className="px-4 py-2.5 text-[0.62rem] font-black tracking-[2.5px] uppercase border-b border-soft"
        style={{ color: titleColor || '#3d4860' }}
      >
        {title}
      </div>
      {children}
    </motion.div>
  )
}

function Row({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-soft">
      <div className="min-w-0">
        <div className="font-bold text-sm">{label}</div>
        {sub && <div className="text-t2 text-xs mt-0.5 truncate max-w-[180px]">{sub}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

/* Flat structure so peer-checked works on thumb */
function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-soft">
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm">{label}</div>
        {sub && <div className="text-t2 text-xs mt-0.5">{sub}</div>}
      </div>
      <label className="relative w-12 h-6 cursor-pointer flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="absolute inset-0 rounded-full transition-all duration-200 bg-card2 border border-soft peer-checked:border-green peer-checked:bg-green" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-all duration-200 bg-[#7a859e] peer-checked:translate-x-6 peer-checked:bg-white" />
      </label>
    </div>
  )
}

function StatRow({ label, val, cls = 'text-t2' }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-soft">
      <div className="font-bold text-sm">{label}</div>
      <span className={`font-black text-sm ${cls}`}>{val}</span>
    </div>
  )
}

function DangerRow({ label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 border-t border-soft active:bg-red/10 transition-all text-left"
      style={{ color: '#FF4B4B' }}
    >
      <div>
        <div className="font-bold text-sm">{label}</div>
        {sub && <div className="text-t2 text-xs mt-0.5">{sub}</div>}
      </div>
      <span className="text-xl opacity-50">›</span>
    </button>
  )
}

function ChipBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-extrabold transition-all flex-shrink-0 active:scale-95"
      style={{
        background: '#1a2133',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#7a859e',
      }}
    >
      {children}
    </button>
  )
}
