import { Router } from 'express'
import { updateMe, loseHeart, refillHeartsRoute } from '../controllers/userController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.patch('/me',            updateMe)
router.post('/me/lose-heart',  loseHeart)
router.post('/me/refill',      refillHeartsRoute)

export default router
