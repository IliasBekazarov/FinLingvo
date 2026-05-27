// Leagues config — 7 leagues
export const LEAGUES = [
  { id: 'bronze',   name: 'ЖЕЗ',     color: '#CD7F32', minXP: 0    },
  { id: 'silver',   name: 'КҮМҮШ',   color: '#B8BCC8', minXP: 200  },
  { id: 'gold',     name: 'АЛТЫН',   color: '#FFD700', minXP: 500  },
  { id: 'ruby',     name: 'РУБИН',   color: '#FF4655', minXP: 1000 },
  { id: 'emerald',  name: 'ИЗИМРУД', color: '#00C896', minXP: 2000 },
  { id: 'amethyst', name: 'АМЕТИСТ', color: '#A855F7', minXP: 4000 },
  { id: 'pearl',    name: 'БЕРМЕТ',  color: '#22D3EE', minXP: 7000 },
]

export function calculateLeague(xp) {
  const sorted = [...LEAGUES].sort((a, b) => b.minXP - a.minXP)
  return sorted.find(l => xp >= l.minXP)?.id ?? 'bronze'
}

export function calculateLevel(xp) {
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1)
}

export function checkAchievements(user, completedLessons, achievements) {
  const newAchs = []
  const earned = new Set(achievements.map(a => a.achievementId))

  const checks = [
    { id: 'first_lesson',  cond: completedLessons >= 1 },
    { id: 'lessons_5',     cond: completedLessons >= 5 },
    { id: 'lessons_10',    cond: completedLessons >= 10 },
    { id: 'lessons_25',    cond: completedLessons >= 25 },
    { id: 'streak_3',      cond: user.streak >= 3 },
    { id: 'streak_7',      cond: user.streak >= 7 },
    { id: 'streak_30',     cond: user.streak >= 30 },
    { id: 'xp_500',        cond: user.xp >= 500 },
    { id: 'xp_1000',       cond: user.xp >= 1000 },
    { id: 'xp_5000',       cond: user.xp >= 5000 },
    { id: 'gems_500',      cond: user.gems >= 500 },
    { id: 'perfect_lesson',cond: false }, // handled separately
  ]

  for (const c of checks) {
    if (c.cond && !earned.has(c.id)) newAchs.push(c.id)
  }
  return newAchs
}

export function refillHearts(user) {
  const now = new Date()
  const last = user.lastHeartRefill ? new Date(user.lastHeartRefill) : new Date(0)
  const minutesPassed = (now - last) / 60000
  const toRefill = Math.floor(minutesPassed / 30)
  if (toRefill <= 0 || user.hearts >= user.maxHearts) return { hearts: user.hearts, lastHeartRefill: user.lastHeartRefill }
  const newHearts = Math.min(user.hearts + toRefill, user.maxHearts)
  const refillTime = new Date(last.getTime() + toRefill * 30 * 60000)
  return { hearts: newHearts, lastHeartRefill: refillTime }
}

export function updateStreak(user) {
  const now = new Date()
  const today = now.toDateString()
  const last = user.lastActivity ? new Date(user.lastActivity) : null
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (!last) return { streak: 1, lastActivity: now }
  if (last.toDateString() === today) return { streak: user.streak, lastActivity: user.lastActivity }
  if (last.toDateString() === yesterday.toDateString()) return { streak: user.streak + 1, lastActivity: now }
  return { streak: 1, lastActivity: now }
}
