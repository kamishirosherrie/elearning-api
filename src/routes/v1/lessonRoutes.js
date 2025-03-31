import express from 'express'
import {
    addNewLesson,
    getAllLessons,
    getLessonByCourseSlug,
    getLessonBySlug,
    updateLesson,
} from '~/controllers/lessonController'

const lessonRouter = express.Router()

lessonRouter.get('/', getAllLessons)
lessonRouter.get('/slug/:slug', getLessonBySlug)
lessonRouter.get('/:courseName', getLessonByCourseSlug)
lessonRouter.post('/addNewLesson', addNewLesson)
lessonRouter.put('/updateLesson', updateLesson)

export { lessonRouter }
