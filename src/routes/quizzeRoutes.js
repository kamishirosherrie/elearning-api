import express from 'express'
import { addNewQuizze, getAllQuizze, getQuizzeByLessonSlug, getQuizzeBySlug } from '~/controllers/quizzeController'

const quizzeRouter = express.Router()

quizzeRouter.get('/', getAllQuizze)
quizzeRouter.get('/getQuizzeBySlug/:slug', getQuizzeBySlug)
quizzeRouter.get('/getQuizzeByLessonSlug/:lessonSlug', getQuizzeByLessonSlug)
quizzeRouter.post('/addNewQuizze', addNewQuizze)

export { quizzeRouter }
