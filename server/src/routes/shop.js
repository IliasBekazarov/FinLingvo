import { Router } from 'express'
import { getItems, buyItem, claimDaily } from '../controllers/shopController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/',         getItems)
router.post('/buy',     buyItem)
router.post('/daily',   claimDaily)

export default router
