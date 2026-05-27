import { prisma } from '../lib/prisma.js'
import { z } from 'zod'

const SHOP_ITEMS = [
  { id: 'hearts_refill', name: 'Жандарды толтуруу', description: '+5 жан дароо', icon: '❤️', price: 350, category: 'hearts', effect: { hearts: 5 } },
  { id: 'heart_single',  name: '1 жан',              description: '+1 жан',       icon: '💗', price: 80,  category: 'hearts', effect: { hearts: 1 } },
  { id: 'streak_freeze', name: 'Streak Freeze',       description: '1 күн streak коргоо', icon: '🧊', price: 200, category: 'streaks' },
  { id: 'streak_repair', name: 'Streak Repair',       description: 'Жоголгон streak кайтаруу', icon: '🔥', price: 300, category: 'streaks' },
  { id: 'xp_boost',      name: 'XP Boost x2',         description: '1 саат бою 2x XP',   icon: '⚡', price: 150, category: 'boosts' },
  { id: 'gem_pack_s',    name: 'Gem Pack — S',         description: '+50 💎',             icon: '💎', price: 0,   category: 'boosts' },
  { id: 'avatar_owl',    name: 'Жапалак аватары',      description: '🦉 Акылдуу жапалак', icon: '🦉', price: 500, category: 'avatars' },
  { id: 'avatar_lion',   name: 'Арстан аватары',       description: '🦁 Күчтүү арстан',   icon: '🦁', price: 600, category: 'avatars' },
  { id: 'avatar_phoenix',name: 'Феникс аватары',       description: '🔥 Чексиз феникс',   icon: '🦅', price: 999, category: 'avatars' },
]

const buySchema = z.object({ itemId: z.string() })

export function getItems(req, res) {
  res.json(SHOP_ITEMS)
}

export async function buyItem(req, res, next) {
  try {
    const { itemId } = buySchema.parse(req.body)
    const item = SHOP_ITEMS.find(i => i.id === itemId)
    if (!item) return res.status(404).json({ error: 'Буюм табылган жок' })

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.userId },
      include: { inventory: true },
    })

    // Check already owned (for avatars/streaks)
    const alreadyOwned = user.inventory.some(i => i.itemId === itemId)
    if (alreadyOwned && item.category !== 'hearts') {
      return res.status(409).json({ error: 'Бул буюм сизде бар' })
    }

    if (user.gems < item.price) {
      return res.status(402).json({ error: 'Gem жетишсиз' })
    }

    const updates = { gems: user.gems - item.price }
    if (item.effect?.hearts) {
      updates.hearts = Math.min(user.hearts + item.effect.hearts, user.maxHearts)
    }

    const [updated] = await prisma.$transaction([
      prisma.user.update({ where: { id: req.userId }, data: updates }),
      prisma.inventoryItem.upsert({
        where: { userId_itemId: { userId: req.userId, itemId } },
        create: { userId: req.userId, itemId },
        update: {},
      }),
    ])

    const { password, ...safe } = updated
    res.json({ success: true, user: safe, item })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors[0].message })
    next(e)
  }
}

export async function claimDaily(req, res, next) {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.userId } })
    const today = new Date().toDateString()
    if (user.lastDailyClaim?.toDateString() === today) {
      return res.status(409).json({ error: 'Бүгүн алдың! Эртең кел 🎁' })
    }
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { gems: user.gems + 50, lastDailyClaim: new Date() },
    })
    res.json({ gems: updated.gems, earned: 50 })
  } catch (e) { next(e) }
}
