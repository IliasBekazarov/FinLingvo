import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { z } from 'zod'

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

const registerSchema = z.object({
  name:  z.string().min(2).max(40),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

const INCLUDE_ALL = { progress: true, achievements: true, inventory: true }

export async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body)
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) return res.status(409).json({ error: 'Бул email катталган' })

    const hashed = await bcrypt.hash(data.password, 12)
    const created = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed },
    })
    // Re-fetch with all relations so client gets full user object
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: created.id },
      include: INCLUDE_ALL,
    })

    const token = signToken(user.id)
    res.status(201).json({ token, user: sanitize(user) })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors[0].message })
    next(e)
  }
}

export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body)
    // Include all relations so client gets progress, achievements, inventory
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: INCLUDE_ALL,
    })
    if (!user) return res.status(401).json({ error: 'Email же сырсөз туура эмес' })

    const ok = await bcrypt.compare(data.password, user.password)
    if (!ok) return res.status(401).json({ error: 'Email же сырсөз туура эмес' })

    const token = signToken(user.id)
    res.json({ token, user: sanitize(user) })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors[0].message })
    next(e)
  }
}

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.userId },
      include: {
        progress:     true,
        achievements: true,
        inventory:    true,
      },
    })
    res.json(sanitize(user))
  } catch (e) { next(e) }
}

function sanitize(u) {
  const { password, ...rest } = u
  return rest
}
