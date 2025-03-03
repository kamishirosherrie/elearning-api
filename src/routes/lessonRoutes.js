import express from 'express'
import { addNewLesson, getAllLessons } from '~/controllers/lessonController'

const lessonRouter = express.Router()

lessonRouter.get('/', getAllLessons)
lessonRouter.post('/addNewLesson', addNewLesson)

export { lessonRouter }
