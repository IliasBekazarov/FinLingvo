import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { useLessonStore } from '@/store/lessonStore'
import { MODULES } from '@/data/content'

/* ─── helpers ───────────────────────────────────────────────── */

/* ─── Node sizes & positions (zigzag) ──────────────────────── */
const SIZES = [
  { w: 80, cls: 'w-20 h-20' },
  { w: 68, cls: 'w-[68px] h-[68px]' },
  { w: 56, cls: 'w-14 h-14' },
]
const POS = ['self-center', 'self-end mr-[18%]', 'self-start ml-[18%]']

/* ─── Node SVG icons ────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.95)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function LockIcon({ size }) {
  const s = size < 70 ? 16 : 20
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  )
}

/* ─── Single lesson node ─────────────────────────────────────
   No hover tooltip — shows lesson meta below label (mobile-safe)
─────────────────────────────────────────────────────────────── */
function Node({ lesson, state, onClick, posIdx }) {
  const sz  = SIZES[Math.min(posIdx, 2)]
  const pos = POS[posIdx % 3]

  const style =
    state === 'completed' ? {
      background: 'linear-gradient(145deg,#65e004,#46a302)',
      border:     '3.5px solid rgba(255,255,255,0.2)',
      boxShadow:  '0 6px 24px rgba(88,204,2,0.4)',
    } :
    state === 'current' ? {
      background: 'linear-gradient(145deg,#2bbfff,#0e8ccf)',
      border:     '3.5px solid rgba(255,255,255,0.28)',
      boxShadow:  '0 6px 28px rgba(28,176,246,0.55)',
    } : {
      background: 'linear-gradient(145deg,#1a2133,#131826)',
      border:     '3.5px solid rgba(255,255,255,0.05)',
      boxShadow:  'none',
    }

  return (
    <div className={`relative flex flex-col items-center gap-1.5 ${pos}`}>
      {/* Node button */}
      <motion.button
        whileTap={state !== 'locked' ? { scale: 0.91 } : {}}
        onClick={onClick}
        className={`rounded-full flex items-center justify-center relative ${sz.cls} ${
          state === 'current'   ? 'animate-pulse-blue'  :
          state === 'completed' ? 'animate-pulse-green' : ''
        }`}
        style={style}
      >
        {state === 'completed' && <CheckIcon />}
        {state === 'locked'    && <LockIcon size={sz.w} />}
        {state === 'current'   && (
          <div className="w-4 h-4 rounded-full bg-white/30 ring-4 ring-white/10" />
        )}
      </motion.button>

      {/* Label */}
      <div className={`text-center text-xs font-bold leading-tight max-w-[84px] ${
        state === 'current'   ? 'text-white'  :
        state === 'completed' ? 'text-green'  : 'text-t3'
      }`}>
        {lesson.title}
      </div>

      {/* Always-visible lesson meta (replaces hover tooltip — works on mobile) */}
      {state !== 'locked' && (
        <div className="text-center" style={{ fontSize: 9, color: '#3d4860', lineHeight: 1.3 }}>
          {state === 'completed'
            ? <span style={{ color: '#58CC0280' }}>✓ Аяктадың</span>
            : `${lesson.questions?.length ?? 0} суроо · +${lesson.xpReward} XP`
          }
        </div>
      )}
    </div>
  )
}

/* ─── Connector line ────────────────────────────────────────── */
function Connector({ done }) {
  return (
    <div className="flex justify-center my-0.5">
      <div className="w-0.5 h-8 rounded-full" style={{
        background: done
          ? 'linear-gradient(180deg,rgba(88,204,2,0.5),rgba(88,204,2,0.15))'
          : 'rgba(255,255,255,0.05)',
      }} />
    </div>
  )
}

/* ─── Module header — uses each module's own color ─────────── */
function ModuleHeader({ mod, mIdx, done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const c   = mod.color || '#1CB0F6'
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: mIdx * 0.04, duration: 0.26 }}
      className="flex items-center gap-3 rounded-2xl p-4 mb-5 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg,${c}18 0%,${c}08 100%)`,
        border: `1px solid ${c}30`,
      }}
    >
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
        backgroundSize: '18px 18px',
      }} />

      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 relative"
        style={{ background: c + '20' }}>
        {mod.emoji}
      </div>

      <div className="flex-1 min-w-0 relative">
        <div className="font-black uppercase mb-0.5"
          style={{ fontSize: 9, letterSpacing: '0.14em', color: c }}>
          {mIdx + 1}-БӨЛҮМ
        </div>
        <div className="font-black text-sm leading-snug truncate">{mod.title}</div>
        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: mIdx * 0.06 }}
            className="h-full rounded-full"
            style={{ background: c }}
          />
        </div>
      </div>

      <div className="text-right flex-shrink-0 relative">
        <div className="text-lg font-black leading-none" style={{ color: c }}>{done}/{total}</div>
        <div className="font-bold mt-0.5" style={{ fontSize: 10, color: c + '60' }}>{pct}%</div>
      </div>
    </motion.div>
  )
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function Learn() {
  const user            = useAuthStore(s => s.user)
  const saveLessonState = useLessonStore(s => s.saveLessonState)
  const navigate        = useNavigate()

  const progress = user?.progress || []

  function isCompleted(id)  { return progress.some(p => p.lessonId === id) }

  function isUnlocked(lessonId) {
    for (const mod of MODULES) {
      const idx = mod.lessons.findIndex(l => l.id === lessonId)
      if (idx === -1) continue
      if (idx === 0) {
        const mi = MODULES.indexOf(mod)
        if (mi === 0) return true
        return MODULES[mi - 1].lessons.every(l => isCompleted(l.id))
      }
      return isCompleted(mod.lessons[idx - 1].id)
    }
    return false
  }

  function startLesson(lesson, mod, unlocked) {
    if (!unlocked) { toast('Алдыңкы сабакты аяктаңыз!', { icon: '🔒' }); return }
    if ((user?.hearts ?? 0) <= 0) { toast.error('Жандар бүттү! Дүкөндөн алыңыз.'); navigate('/shop'); return }
    saveLessonState({
      moduleId: mod.id, lessonId: lesson.id,
      moduleTitle: mod.title, lessonTitle: lesson.title,
      questions: lesson.questions, xpReward: lesson.xpReward, gemReward: lesson.gemReward,
    })
    navigate('/lesson')
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 py-5 w-full">

      {/* ── Modules ── */}
      {MODULES.map((mod, mIdx) => {
        const done  = mod.lessons.filter(l => isCompleted(l.id)).length
        const total = mod.lessons.length

        return (
          <div key={mod.id} className="mb-4">
            {/* Module header */}
            <ModuleHeader mod={mod} mIdx={mIdx} done={done} total={total} />

            {/* Lesson nodes */}
            <div className="flex flex-col w-full mb-3">
              {mod.lessons.map((lesson, lIdx) => {
                const completed = isCompleted(lesson.id)
                const unlocked  = isUnlocked(lesson.id)
                const state     = completed ? 'completed' : unlocked ? 'current' : 'locked'

                return (
                  <div key={lesson.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: mIdx * 0.05 + lIdx * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
                    >
                      <Node
                        lesson={lesson}
                        state={state}
                        posIdx={lIdx}
                        onClick={() => startLesson(lesson, mod, unlocked)}
                      />
                    </motion.div>

                    {/* Connector between nodes */}
                    {lIdx < mod.lessons.length - 1 && (
                      <Connector done={completed} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Module spacer */}
            <div className="h-4" />
          </div>
        )
      })}
    </div>
  )
}
