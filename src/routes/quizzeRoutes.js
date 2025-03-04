import express from 'express'
import { addNewQuizze, getQuizzeByLesson } from '~/controllers/quizzeController'

const quizzeRouter = express.Router()

quizzeRouter.get('/getQuizzeByLesson/:lessonSlug', getQuizzeByLesson)
quizzeRouter.post('/addNewQuizze', addNewQuizze)

export { quizzeRouter }
