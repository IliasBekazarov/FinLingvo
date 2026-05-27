import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLessonStore } from '@/store/lessonStore'
import { useAuthStore } from '@/store/authStore'
import { ACHIEVEMENTS } from '@/data/content'
import { launchConfetti } from '@/lib/confetti'
import { audio } from '@/lib/audio'

export default function Result() {
  const navigate    = useNavigate()
  const result      = useLessonStore(s => s.result)
  const clearResult = useLessonStore(s => s.clearResult)
  const user        = useAuthStore(s => s.user)   // eslint-disable-line no-unused-vars

  useEffect(() => {
    if (!result) { navigate('/learn'); return }
    if (result.stars >= 3) { setTimeout(() => { launchConfetti(); audio.levelup() }, 500) }
    else audio.complete()
  }, [])

  if (!result) return null

  const {
    stars, perfect, xpEarned, gemsEarned,
    correctCount, totalQuestions,
    lessonTitle, moduleTitle,
    newAchievements = [],
  } = result

  const acc = Math.round((correctCount / totalQuestions) * 100)

  const titles = { 3: 'Укмуштуудай!', 2: 'Жакшы иш!', 1: 'Улантуу!' }
  const trophy = perfect ? '🏆' : stars >= 2 ? '🎯' : '💪'

  function continueLearn() {
    clearResult()
    navigate('/learn')
  }

  function share() {
    const text = `FinLingvo'до "${lessonTitle}" сабагын аяктадым! +${xpEarned} XP! 🎉`
    if (navigator.share) {
      navigator.share({ title: 'FinLingvo', text }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {})
    }
  }

  return (
    <div
      className="min-h-screen bg-bg flex flex-col items-center justify-center px-5 text-center relative overflow-hidden"
      style={{ paddingTop: 24, paddingBottom: `max(24px, env(safe-area-inset-bottom))` }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-blue/8 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-green/6 blur-[100px] rounded-full" />
      </div>

      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

      <div className="max-w-sm w-full z-10 space-y-4">

        {/* Trophy */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="text-6xl sm:text-8xl inline-block drop-shadow-[0_15px_30px_rgba(255,215,0,0.3)]"
        >
          {trophy}
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-3xl sm:text-4xl font-black gradient-text-gold">{titles[stars] || 'Аяктадың!'}</h1>
          <p className="text-t2 text-sm font-semibold mt-1">{lessonTitle} · {moduleTitle}</p>
        </motion.div>

        {/* Stars */}
        <div className="flex justify-center gap-3 sm:gap-4">
          {[1, 2, 3].map(i => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: i <= stars ? 1 : 0.4, opacity: i <= stars ? 1 : 0.2 }}
              transition={{ delay: 0.5 + i * 0.2, type: 'spring', stiffness: 300 }}
              className="text-4xl sm:text-5xl"
            >⭐</motion.span>
          ))}
        </div>

        {/* Perfect badge */}
        {perfect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="py-3 px-4 bg-green/12 border-2 border-green/35 rounded-2xl text-green text-sm font-extrabold"
          >
            ✨ МҮНӨЗСҮЗ! Бир да ката жок! +25 Бонус XP ✨
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-2 sm:gap-3"
        >
          {[
            { val: xpEarned,       label: 'XP',     cls: 'gradient-text-green', border: 'border-green/30' },
            { val: gemsEarned,     label: '💎 Gems', cls: 'gradient-text-blue',  border: 'border-blue/30' },
            { val: acc + '%',      label: 'Тактык',  cls: 'text-orange',         border: 'border-orange/30' },
          ].map(({ val, label, cls, border }) => (
            <div key={label} className={`bg-card border-[1.5px] ${border} rounded-2xl p-2.5 sm:p-3`}>
              <span className={`text-xl sm:text-2xl font-black block ${cls}`}>{val}</span>
              <span className="text-[0.58rem] font-extrabold text-t2 uppercase tracking-wider leading-tight">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* New achievements */}
        {newAchievements?.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            {newAchievements.map(id => {
              const a = ACHIEVEMENTS?.find(x => x.id === id)
              if (!a) return null
              return (
                <div key={id} className="flex items-center gap-3 bg-gradient-to-r from-yellow/10 to-yellow/5 border-[1.5px] border-yellow/35 rounded-2xl p-3 mb-2 text-left">
                  <span className="text-3xl sm:text-4xl flex-shrink-0">{a.icon}</span>
                  <div>
                    <div className="text-[0.6rem] font-black tracking-widest text-yellow uppercase">ЖАҢЫ ЖЕТИШКЕНДИК</div>
                    <div className="font-black text-sm">{a.title}</div>
                    <div className="text-t2 text-xs">{a.description}</div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-2.5 pt-1"
        >
          <button
            onClick={continueLearn}
            className="w-full py-4 bg-blue hover:bg-blue-dark active:scale-[0.98] text-white font-black tracking-widest uppercase rounded-2xl shadow-blue-glow transition-all hover:-translate-y-0.5"
          >
            УЛАНТУУ →
          </button>
          <button
            onClick={share}
            className="w-full py-3.5 bg-green/8 hover:bg-green/14 active:bg-green/14 text-green font-extrabold rounded-2xl border border-green/30 transition-all active:scale-[0.98]"
          >
            📤 БӨЛҮШҮҮ
          </button>
          <button
            onClick={continueLearn}
            className="w-full py-3 bg-card2 hover:bg-card3 active:bg-card3 text-t2 hover:text-white font-extrabold rounded-2xl border border-soft transition-all active:scale-[0.98]"
          >
            ← ҮЙРӨНҮҮГӨ КАЙТУУ
          </button>
        </motion.div>

      </div>
    </div>
  )
}
