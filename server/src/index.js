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

// Security
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
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
