import express from 'express'
import { addNewQuizze, getAllQuizze, getQuizzeByLesson } from '~/controllers/quizzeController'

const quizzeRouter = express.Router()

quizzeRouter.get('/', getAllQuizze)
quizzeRouter.get('/getQuizzeByLesson/:lessonSlug', getQuizzeByLesson)
quizzeRouter.post('/addNewQuizze', addNewQuizze)

export { quizzeRouter }
