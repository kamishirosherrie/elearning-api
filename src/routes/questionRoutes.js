import express from 'express'
import { addNewQuestion, getAllQuestions } from '~/controllers/questionController'

const questionRouter = express.Router()

questionRouter.get('/', getAllQuestions)
questionRouter.post('/addNewQuestion', addNewQuestion)

export { questionRouter }
