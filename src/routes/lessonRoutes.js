import express from 'express'
import { addNewLesson, getAllLessons, getLessonByCourseSlug, getLessonBySlug } from '~/controllers/lessonController'

const lessonRouter = express.Router()

lessonRouter.get('/', getAllLessons)
lessonRouter.get('/course/:slug', getLessonBySlug)
lessonRouter.get('/:courseName', getLessonByCourseSlug)
lessonRouter.post('/addNewLesson', addNewLesson)

export { lessonRouter }
