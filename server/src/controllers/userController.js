import { prisma } from '../lib/prisma.js'
import { refillHearts } from '../lib/gameLogic.js'
import { z } from 'zod'

const updateSchema = z.object({
  name:     z.string().min(2).max(40).optional(),
  avatar:   z.string().optional(),
  settings: z.record(z.any()).optional(),
})

export async function updateMe(req, res, next) {
  try {
    const data = updateSchema.parse(req.body)
    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      include: { progress: true, achievements: true, inventory: true },
    })
    const { password, ...safe } = user
    res.json(safe)
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors[0].message })
    next(e)
  }
}

export async function loseHeart(req, res, next) {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.userId } })
    const { hearts, lastHeartRefill } = refillHearts(user)
    const newHearts = Math.max(0, hearts - 1)
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { hearts: newHearts, lastHeartRefill },
    })
    res.json({ hearts: updated.hearts })
  } catch (e) { next(e) }
}

export async function refillHeartsRoute(req, res, next) {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.userId } })
    const { hearts, lastHeartRefill } = refillHearts(user)
    if (hearts === user.hearts) return res.json({ hearts: user.hearts })
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { hearts, lastHeartRefill },
    })
    res.json({ hearts: updated.hearts })
  } catch (e) { next(e) }
}
