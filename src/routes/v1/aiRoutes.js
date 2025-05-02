import express from 'express'
import { handleSpeakingConversation, loadChatHistory, talkWithAI } from '~/controllers/aiController'

const aiRouter = express.Router()

aiRouter.get('/', loadChatHistory)
aiRouter.post('/speaking/conversation', handleSpeakingConversation)
aiRouter.post('/talk', talkWithAI)

export { aiRouter }
