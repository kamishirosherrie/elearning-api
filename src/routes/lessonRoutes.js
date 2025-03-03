import express from 'express'
import { addNewLesson, getAllLessons, getLessonByCourse } from '~/controllers/lessonController'

const lessonRouter = express.Router()

lessonRouter.get('/', getAllLessons)
lessonRouter.get('/:courseName', getLessonByCourse)
lessonRouter.post('/addNewLesson', addNewLesson)

export { lessonRouter }
