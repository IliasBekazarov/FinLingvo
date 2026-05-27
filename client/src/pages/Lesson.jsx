import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useLessonStore } from '@/store/lessonStore'
import { audio } from '@/lib/audio'
import api from '@/lib/api'

export default function Lesson() {
  const navigate         = useNavigate()
  const user             = useAuthStore(s => s.user)
  const setUser          = useAuthStore(s => s.setUser)
  const ls               = useLessonStore(s => s.lessonState)
  const saveResult       = useLessonStore(s => s.saveResult)
  const clearLessonState = useLessonStore(s => s.clearLessonState)

  const [curQ, setCurQ]       = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect]   = useState(false)
  const [correctCnt, setCorrectCnt] = useState(0)
  const [wrongCnt, setWrongCnt]     = useState(0)
  const [showQuit, setShowQuit]     = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)

  useEffect(() => { if (!ls) navigate('/learn') }, [ls])

  const q      = ls?.questions?.[curQ]
  const hearts = user?.hearts ?? 5
  const total  = ls?.questions?.length ?? 1
  const progPct = (curQ / total) * 100

  async function loseHeart() {
    try {
      const { hearts: h } = await api.post('/users/me/lose-heart')
      setUser({ ...user, hearts: h })
      if (h <= 0) setTimeout(() => setShowGameOver(true), 1600)
    } catch {}
  }

  function check() {
    if (answered || selected === null) return
    setAnswered(true)
    let ok = false
    if (q.type === 'multiple_choice') ok = selected === q.options.findIndex(o => o.correct)
    else if (q.type === 'true_false')  ok = selected === q.correct
    else if (q.type === 'fill_blank')  ok = selected === q.answer
    setCorrect(ok)
    if (ok) { setCorrectCnt(c => c + 1); audio.correct() }
    else    { setWrongCnt(c => c + 1); loseHeart(); audio.wrong() }
  }

  async function next() {
    if (curQ + 1 >= total) { await finish(); return }
    setCurQ(c => c + 1)
    setSelected(null); setAnswered(false); setCorrect(false)
  }

  async function finish() {
    const perfect = wrongCnt === 0
    const stars   = perfect ? 3 : wrongCnt <= 2 ? 2 : 1
    const totalXP = (ls.xpReward || 50) + correctCnt * 10 + (perfect ? 25 : 0)
    try {
      const { user: u, result } = await api.post('/progress/complete', {
        lessonId: ls.lessonId, lessonTitle: ls.lessonTitle, moduleTitle: ls.moduleTitle,
        stars, perfect, xpEarned: totalXP, gemsEarned: ls.gemReward || 10,
        correctCount: correctCnt, wrongCount: wrongCnt, totalQuestions: total,
      })
      setUser(u)
      saveResult({ ...result, lessonTitle: ls.lessonTitle, moduleTitle: ls.moduleTitle, xpEarned: totalXP, gemsEarned: ls.gemReward || 10, stars, perfect, correctCount: correctCnt, wrongCount: wrongCnt, totalQuestions: total })
    } catch {
      saveResult({ lessonTitle: ls.lessonTitle, moduleTitle: ls.moduleTitle, xpEarned: totalXP, gemsEarned: ls.gemReward || 10, stars, perfect, correctCount: correctCnt, wrongCount: wrongCnt, totalQuestions: total, newAchievements: [] })
    }
    clearLessonState()
    audio.complete()
    navigate('/result')
  }

  if (!ls || !q) return null

  const LABELS = { multiple_choice: 'ТУУРА ЖООП', true_false: 'ЧЫН ЖЕ ЖАЛГАН?', fill_blank: 'БОШТУКТУ ТОЛ' }

  return (
    <div className="min-h-screen bg-bg flex flex-col" style={{ background: '#0a0d18' }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 flex items-center gap-2 px-4 py-2.5"
        style={{
          background: 'rgba(10,13,24,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <button
          onClick={() => setShowQuit(true)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-t2 hover:text-red transition-all active:scale-90 flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-2.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            animate={{ width: `${progPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#58CC02,#46d000)' }}
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-0.5 flex-shrink-0 px-2 py-1 rounded-full"
          style={{ background: 'rgba(255,75,75,0.08)', border: '1px solid rgba(255,75,75,0.18)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#FF4B4B">
            <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.6z"/>
          </svg>
          <span className="font-black text-xs" style={{ color: '#FF4B4B' }}>{hearts}</span>
        </div>
      </header>

      {/* ── Question body ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 max-w-[640px] mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={curQ}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
          >
            {/* Meta */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[0.62rem] font-black tracking-[2px] uppercase text-t3">
                {LABELS[q.type]}
              </span>
              <span className="text-[0.62rem] font-black text-t3">{curQ + 1}/{total}</span>
            </div>

            {/* Question card */}
            <div className="rounded-2xl p-4 mb-5"
              style={{ background: '#131826', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-lg font-extrabold leading-relaxed">{q.question}</p>
            </div>

            {/* ── Multiple choice ── */}
            {q.type === 'multiple_choice' && (
              <div className="space-y-2.5">
                {q.options.map((o, i) => {
                  const ci = q.options.findIndex(op => op.correct)
                  const isSel = selected === i
                  const isOk  = answered && i === ci
                  const isBad = answered && isSel && !o.correct
                  return (
                    <motion.button
                      key={i}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={() => !answered && setSelected(i)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 font-bold text-sm text-left transition-all active:scale-[0.99]"
                      style={{
                        borderColor: isOk  ? '#58CC02' : isBad ? '#FF4B4B' : isSel ? '#1CB0F6' : 'rgba(255,255,255,0.09)',
                        background:  isOk  ? 'rgba(88,204,2,0.1)' : isBad ? 'rgba(255,75,75,0.1)' : isSel ? 'rgba(28,176,246,0.1)' : '#131826',
                      }}
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 transition-all"
                        style={{
                          background: isOk ? '#58CC02' : isBad ? '#FF4B4B' : isSel ? '#1CB0F6' : 'rgba(255,255,255,0.07)',
                          color: (isOk || isBad || isSel) ? '#fff' : '#7a859e',
                        }}>
                        {['A','B','C','D'][i]}
                      </span>
                      <span className="flex-1">{o.text}</span>
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* ── True / False ── */}
            {q.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {[{ val: true, label: 'ЧЫН', icon: '✅' }, { val: false, label: 'ЖАЛГАН', icon: '❌' }].map(({ val, label, icon }) => {
                  const isSel = selected === val
                  const isOk  = answered && val === q.correct
                  const isBad = answered && isSel && val !== q.correct
                  return (
                    <motion.button
                      key={String(val)}
                      whileTap={!answered ? { scale: 0.95 } : {}}
                      onClick={() => !answered && setSelected(val)}
                      className="py-6 rounded-2xl border-2 font-black flex flex-col items-center gap-2 text-3xl transition-all"
                      style={{
                        borderColor: isOk ? '#58CC02' : isBad ? '#FF4B4B' : isSel ? (val ? '#58CC02' : '#FF4B4B') : 'rgba(255,255,255,0.09)',
                        background:  isOk ? 'rgba(88,204,2,0.1)' : isBad ? 'rgba(255,75,75,0.1)' : isSel ? 'rgba(255,255,255,0.05)' : '#131826',
                      }}
                    >
                      {icon}
                      <span className="text-sm tracking-wider">{label}</span>
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* ── Fill blank ── */}
            {q.type === 'fill_blank' && (
              <div className="space-y-3">
                <div className="rounded-xl p-4 text-center font-bold text-base min-h-[52px] flex flex-wrap items-center justify-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.1)' }}>
                  <span>{q.question.split('___')[0]}</span>
                  <span className="font-black px-3 py-0.5 rounded-lg transition-all"
                    style={{ borderBottom: `2px solid ${selected ? '#1CB0F6' : 'rgba(255,255,255,0.2)'}`, color: selected ? '#1CB0F6' : '#7a859e', minWidth: 60 }}>
                    {selected ?? '___'}
                  </span>
                  <span>{q.question.split('___')[1]}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {q.options.map((o, i) => {
                    const isSel = selected === o
                    const isOk  = answered && o === q.answer
                    const isBad = answered && isSel && o !== q.answer
                    return (
                      <motion.button
                        key={i}
                        whileTap={!answered ? { scale: 0.96 } : {}}
                        onClick={() => !answered && setSelected(o)}
                        className="py-3 rounded-xl border-2 font-bold text-sm transition-all"
                        style={{
                          borderColor: isOk ? '#58CC02' : isBad ? '#FF4B4B' : isSel ? '#1CB0F6' : 'rgba(255,255,255,0.09)',
                          background:  isOk ? 'rgba(88,204,2,0.1)' : isBad ? 'rgba(255,75,75,0.1)' : isSel ? 'rgba(28,176,246,0.1)' : '#131826',
                        }}
                      >{o}</motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Hint */}
            {q.hint && !answered && <HintBtn hint={q.hint} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom panel ── */}
      <AnimatePresence>
        {!answered ? (
          <motion.div key="check"
            initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 px-4 py-3"
            style={{
              paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
              background: 'rgba(10,13,24,0.96)',
              backdropFilter: 'blur(16px)',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <button
              onClick={check}
              disabled={selected === null}
              className="w-full max-w-[560px] mx-auto block py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all active:scale-[0.98]"
              style={{
                background: selected !== null ? '#58CC02' : 'rgba(255,255,255,0.06)',
                color: selected !== null ? '#fff' : '#3d4860',
                cursor: selected !== null ? 'pointer' : 'not-allowed',
                boxShadow: selected !== null ? '0 4px 20px rgba(88,204,2,0.35)' : 'none',
              }}
            >
              ТЕКШЕР
            </button>
          </motion.div>
        ) : (
          <motion.div key="feedback"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 px-4 py-4"
            style={{
              paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
              background: correct
                ? 'linear-gradient(180deg,rgba(8,28,8,0.98),rgba(5,18,5,0.98))'
                : 'linear-gradient(180deg,rgba(28,8,8,0.98),rgba(18,5,5,0.98))',
              borderTop: `2px solid ${correct ? '#58CC02' : '#FF4B4B'}`,
            }}
          >
            <div className="max-w-[560px] mx-auto flex items-center gap-3">
              <span className="text-2xl flex-shrink-0">{correct ? '🎉' : '💔'}</span>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm" style={{ color: correct ? '#58CC02' : '#FF4B4B' }}>
                  {correct ? 'Туура!' : 'Туура эмес!'}
                </div>
                <div className="text-t2 text-xs font-semibold mt-0.5 leading-snug line-clamp-2">
                  {q.explanation || (!correct && `Туура: ${q.type === 'multiple_choice' ? q.options.find(o=>o.correct)?.text : q.type === 'true_false' ? (q.correct ? 'Чын' : 'Жалган') : q.answer}`)}
                </div>
              </div>
              <button
                onClick={next}
                className="flex-shrink-0 px-5 py-2.5 rounded-xl font-black text-sm tracking-wide uppercase transition-all active:scale-95"
                style={{
                  background: correct ? '#58CC02' : '#FF4B4B',
                  color: '#fff',
                  boxShadow: correct ? '0 4px 14px rgba(88,204,2,0.4)' : '0 4px 14px rgba(255,75,75,0.4)',
                }}
              >
                УЛАНТУУ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showQuit && (
          <Modal onClose={() => setShowQuit(false)}>
            <div className="text-5xl mb-3">😢</div>
            <h2 className="text-xl font-black mb-2">Чыккыңыз келеби?</h2>
            <p className="text-t2 text-sm font-semibold mb-5">Прогрессиңиз жоголот!</p>
            <button onClick={() => { clearLessonState(); navigate('/learn') }}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-white mb-2 transition-all"
              style={{ background: '#FF4B4B' }}>
              ИЯ, ЧЫГУУ
            </button>
            <button onClick={() => setShowQuit(false)}
              className="w-full py-3 rounded-2xl font-extrabold text-t2 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              УЛАНТТЫРУУ
            </button>
          </Modal>
        )}
        {showGameOver && (
          <Modal onClose={() => navigate('/shop')}>
            <div className="text-6xl mb-3 animate-bounce-in">💔</div>
            <h2 className="text-xl font-black mb-2">Жандар бүттү!</h2>
            <p className="text-t2 text-sm font-semibold mb-5">Жаңы жандарды дүкөндөн алыңыз</p>
            <button onClick={() => navigate('/shop')}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-white mb-2 shadow-blue-glow transition-all"
              style={{ background: '#1CB0F6' }}>
              💎 ДҮКӨНГӨ БАР
            </button>
            <button onClick={() => { clearLessonState(); navigate('/learn') }}
              className="w-full py-3 rounded-2xl font-extrabold text-t2 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              ← ҮЙРӨНҮҮГӨ
            </button>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

function HintBtn({ hint }) {
  const [show, setShow] = useState(false)
  return (
    <div className="mt-4">
      <button onClick={() => setShow(s => !s)}
        className="px-4 py-1.5 rounded-full text-xs font-extrabold transition-all"
        style={{ background: 'rgba(255,217,0,0.08)', border: '1px solid rgba(255,217,0,0.25)', color: '#FFD900' }}>
        💡 Жардам
      </button>
      {show && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 rounded-xl text-xs font-semibold"
          style={{ background: 'rgba(255,217,0,0.06)', border: '1px solid rgba(255,217,0,0.18)', color: '#ffdd66' }}>
          {hint}
        </motion.div>
      )}
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-7 text-center"
        style={{
          background: '#131826',
          border: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
