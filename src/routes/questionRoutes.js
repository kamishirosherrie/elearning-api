import express from 'express'
import { addNewQuestion, getAllQuestions, getQuestionByQuzzieSlug } from '~/controllers/questionController'

const questionRouter = express.Router()

questionRouter.get('/', getAllQuestions)
questionRouter.get('/getQuestionByQuizzeSlug/:quizzeSlug', getQuestionByQuzzieSlug)
questionRouter.post('/addNewQuestion', addNewQuestion)

export { questionRouter }
