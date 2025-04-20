import express from 'express'
import {
    addNewQuizze,
    deleteQuizze,
    getAllQuizze,
    getQuizzeByLessonSlug,
    getQuizzeBySlug,
    getQuizzeByType,
    handleSpeakingConversation,
} from '~/controllers/quizzeController'

const quizzeRouter = express.Router()

quizzeRouter.get('/', getAllQuizze)
quizzeRouter.get('/getQuizzeBySlug/:slug', getQuizzeBySlug)
quizzeRouter.get('/getQuizzeByLessonSlug/:lessonSlug', getQuizzeByLessonSlug)
quizzeRouter.get('/getQuizzeByType/:type', getQuizzeByType)
quizzeRouter.post('/addNewQuizze', addNewQuizze)
quizzeRouter.post('/speaking/conversation', handleSpeakingConversation)
quizzeRouter.delete('/deleteQuizze/:id', deleteQuizze)

export { quizzeRouter }
