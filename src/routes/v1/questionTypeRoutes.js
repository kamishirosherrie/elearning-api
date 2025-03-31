import express from 'express'
import { getQuestionType } from '~/controllers/questionTypeController'

const questionTypeRouter = express.Router()

questionTypeRouter.get('/', getQuestionType)

export { questionTypeRouter }
