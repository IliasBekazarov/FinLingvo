import { prisma } from '../lib/prisma.js'
import { calculateLeague, updateStreak, refillHearts, checkAchievements } from '../lib/gameLogic.js'
import { z } from 'zod'

const completeSchema = z.object({
  lessonId:    z.string(),
  lessonTitle: z.string(),
  moduleTitle: z.string(),
  stars:       z.number().int().min(1).max(3),
  perfect:     z.boolean(),
  xpEarned:    z.number().int().min(0),
  gemsEarned:  z.number().int().min(0),
  correctCount: z.number().int().min(0),
  wrongCount:   z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
})

export async function completeLesson(req, res, next) {
  try {
    const data = completeSchema.parse(req.body)
    const userId = req.userId

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { achievements: true, progress: true },
    })

    // Update streak
    const { streak, lastActivity } = updateStreak(user)
    // Refill hearts
    const { hearts, lastHeartRefill } = refillHearts(user)
    // Calculate new values
    const newXP   = user.xp + data.xpEarned
    const newWXP  = user.weeklyXP + data.xpEarned
    const newGems = user.gems + data.gemsEarned
    const league  = calculateLeague(newXP)

    // Upsert progress
    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: data.lessonId } },
    })
    await prisma.lessonProgress.upsert({
      where:  { userId_lessonId: { userId, lessonId: data.lessonId } },
      create: { userId, lessonId: data.lessonId, stars: data.stars, perfect: data.perfect },
      update: {
        stars:   Math.max(data.stars, existing ? existing.stars : 0),
        perfect: data.perfect || (existing ? existing.perfect : false),
      },
    })

    // Check achievements
    const completedCount = user.progress.length + 1
    const newAchIds = checkAchievements(
      { ...user, xp: newXP, streak },
      completedCount,
      user.achievements,
    )
    if (data.perfect && !user.achievements.some(a => a.achievementId === 'perfect_lesson')) {
      newAchIds.push('perfect_lesson')
    }

    if (newAchIds.length) {
      await prisma.userAchievement.createMany({
        data: newAchIds.map(id => ({ userId, achievementId: id })),
        skipDuplicates: true,
      })
    }

    // Update user
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { xp: newXP, weeklyXP: newWXP, gems: newGems, hearts, lastHeartRefill, streak, lastActivity, league },
      include: { progress: true, achievements: true, inventory: true },
    })

    const { password, ...safe } = updated
    res.json({
      user: safe,
      result: {
        ...data,
        newAchievements: newAchIds,
      },
    })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors[0].message })
    next(e)
  }
}

export async function getProgress(req, res, next) {
  try {
    const progress = await prisma.lessonProgress.findMany({
      where: { userId: req.userId },
    })
    res.json(progress)
  } catch (e) { next(e) }
}
