import express from 'express'
import { allMessages, clearChat, sendMessage } from '../controllers/messageControllers.js'
import { protect } from '../middleware/authMiddleware.js'
// import message from '../models/messageModal'


const router =express.Router()

router.route('/').post(protect,sendMessage)
router.route('/:chatId').get(protect,allMessages)
router.route('/:chatId').delete(protect,clearChat)



export default router


