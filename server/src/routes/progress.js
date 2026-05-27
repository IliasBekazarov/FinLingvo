import { Router } from 'express'
import { completeLesson, getProgress } from '../controllers/progressController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/',        getProgress)
router.post('/complete', completeLesson)

export default router
