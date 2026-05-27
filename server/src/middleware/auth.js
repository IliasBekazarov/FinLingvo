import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Авторизация талап кылынат' })
  }
  try {
    const token = auth.slice(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Токен жараксыз' })
  }
}
