import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import authRoutes        from './routes/auth.js'
import userRoutes        from './routes/users.js'
import progressRoutes    from './routes/progress.js'
import leaderboardRoutes from './routes/leaderboard.js'
import shopRoutes        from './routes/shop.js'
import { errorHandler }  from './middleware/errorHandler.js'

const app  = express()
const PORT = process.env.PORT || 4000

// ── CORS ─────────────────────────────────────────────────────
// CLIENT_URL may be a comma-separated list, e.g.:
//   https://fin-lingvo.vercel.app,https://finlingvo.vercel.app
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, cb) {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    // Also allow any *.vercel.app preview URL during development
    if (origin.endsWith('.vercel.app')) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))

// Security
app.use(helmet())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

// Parsing
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth',        authRoutes)
app.use('/api/users',       userRoutes)
app.use('/api/progress',    progressRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/shop',        shopRoutes)

// Health
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }))

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\n🦅 FinLingvo API → http://localhost:${PORT}\n`)
})
