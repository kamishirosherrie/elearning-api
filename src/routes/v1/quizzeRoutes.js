import express from 'express'
import {
    addNewQuizze,
    deleteQuizze,
    getAllQuizze,
    getQuizzeByLessonSlug,
    getQuizzeBySlug,
    getQuizzeByType,
    updateQuizze,
} from '~/controllers/quizzeController'

const quizzeRouter = express.Router()

quizzeRouter.get('/', getAllQuizze)
quizzeRouter.get('/getQuizzeBySlug/:slug', getQuizzeBySlug)
quizzeRouter.get('/getQuizzeByLessonSlug/:lessonSlug', getQuizzeByLessonSlug)
quizzeRouter.get('/getQuizzeByType/:type', getQuizzeByType)
quizzeRouter.post('/addNewQuizze', addNewQuizze)
quizzeRouter.delete('/deleteQuizze/:id', deleteQuizze)
quizzeRouter.put('/updateQuizze/:id', updateQuizze)

export { quizzeRouter }
