import express from 'express'
import {
    addNewLesson,
    getAllLessons,
    getCurrentLessonOrder,
    getLessonByCourseSlug,
    getLessonById,
    getLessonBySlug,
    updateLesson,
} from '~/controllers/lessonController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const lessonRouter = express.Router()

lessonRouter.get('/', getAllLessons)
lessonRouter.get('/id/:id', getLessonById)
lessonRouter.get('/slug/:slug', getLessonBySlug)
lessonRouter.get('/:courseName', getLessonByCourseSlug)
lessonRouter.get('/getLesson/:courseId/:chapterId', authenticateToken, getCurrentLessonOrder)

lessonRouter.post('/addNewLesson', authenticateToken, addNewLesson)
lessonRouter.put('/updateLesson', authenticateToken, updateLesson)

export { lessonRouter }
