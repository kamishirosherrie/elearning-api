import express from 'express'
import {
    addNewQuestion,
    getAllQuestions,
    getAvailableParts,
    getQuestionByQuzzieSlug,
} from '~/controllers/questionController'

const questionRouter = express.Router()

questionRouter.get('/', getAllQuestions)
questionRouter.get('/slug/:quizzeSlug', getQuestionByQuzzieSlug)
questionRouter.get('/part/:quizzeSlug', getAvailableParts)
questionRouter.post('/addNewQuestion', addNewQuestion)

export { questionRouter }
