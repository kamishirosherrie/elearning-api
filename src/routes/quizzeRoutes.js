import express from 'express'
import { addNewQuizze, getAllQuizze, getQuizzeByLessonSlug, getQuizzeBySlug, getQuizzesWithQuestions } from '~/controllers/quizzeController'

const quizzeRouter = express.Router()

quizzeRouter.get('/', getAllQuizze)
quizzeRouter.get('/getQuizzeBySlug/:slug', getQuizzeBySlug)
quizzeRouter.get('/getQuizzeByLessonSlug/:lessonSlug', getQuizzeByLessonSlug)
quizzeRouter.get('/getQuizzesWithQuestions', getQuizzesWithQuestions)
quizzeRouter.post('/addNewQuizze', addNewQuizze)

export { quizzeRouter }
