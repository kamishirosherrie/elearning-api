import express from 'express'
import { handleSpeakingConversation, talkWithAI } from '~/controllers/aiController'

const aiRouter = express.Router()

aiRouter.post('/speaking/conversation', handleSpeakingConversation)
aiRouter.post('/talk', talkWithAI)

export { aiRouter }
