import express from 'express'
import { addNewQuizze } from '~/controllers/quizzeController'

const quizzeRouter = express.Router()

quizzeRouter.post('/addNewQuizze', addNewQuizze)

export { quizzeRouter }
