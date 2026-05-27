import { prisma } from '../lib/prisma.js'

const DEMO = [
  { name: 'Айбек Д.',   avatar: '🦅', xp: 2840, streak: 14, league: 'gold' },
  { name: 'Жылдыз М.',  avatar: '🌟', xp: 2210, streak: 9,  league: 'gold' },
  { name: 'Канат Э.',   avatar: '🎯', xp: 1870, streak: 7,  league: 'silver' },
  { name: 'Нурзат К.',  avatar: '💪', xp: 1540, streak: 21, league: 'silver' },
  { name: 'Бекзат Ш.',  avatar: '🚀', xp: 1320, streak: 5,  league: 'silver' },
  { name: 'Айгерим Т.', avatar: '✨', xp: 980,  streak: 3,  league: 'bronze' },
  { name: 'Уланбек А.', avatar: '⚡', xp: 760,  streak: 11, league: 'bronze' },
  { name: 'Гулмира Р.', avatar: '🌸', xp: 620,  streak: 2,  league: 'bronze' },
  { name: 'Азамат Б.',  avatar: '🎓', xp: 480,  streak: 4,  league: 'bronze' },
  { name: 'Мирлан О.',  avatar: '🏆', xp: 310,  streak: 1,  league: 'bronze' },
]

export async function getLeaderboard(req, res, next) {
  try {
    const userId = req.userId
    const league = req.query.league || 'bronze'

    // Real users from DB
    const realUsers = await prisma.user.findMany({
      where: { league },
      select: { id: true, name: true, avatar: true, weeklyXP: true, streak: true },
      orderBy: { weeklyXP: 'desc' },
      take: 50,
    })

    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, avatar: true, weeklyXP: true, streak: true, league: true },
    })

    // Merge with demo users to populate leaderboard
    const demoForLeague = DEMO.filter(u => u.league === league).map(u => ({
      id: null, name: u.name, avatar: u.avatar, weeklyXP: u.xp, streak: u.streak, isDemo: true,
    }))

    const allUsers = [...realUsers.map(u => ({ ...u, isDemo: false })), ...demoForLeague]
    allUsers.sort((a, b) => b.weeklyXP - a.weeklyXP)

    res.json({ entries: allUsers, me })
  } catch (e) { next(e) }
}
