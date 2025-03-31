import express from 'express'
import {
    addNewLesson,
    getAllLessons,
    getLessonByCourseSlug,
    getLessonBySlug,
    updateLesson,
} from '~/controllers/lessonController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const lessonRouter = express.Router()

lessonRouter.get('/', getAllLessons)
lessonRouter.get('/slug/:slug', getLessonBySlug)
lessonRouter.get('/:courseName', getLessonByCourseSlug)
lessonRouter.post('/addNewLesson', authenticateToken, addNewLesson)
lessonRouter.put('/updateLesson', authenticateToken, updateLesson)

export { lessonRouter }
