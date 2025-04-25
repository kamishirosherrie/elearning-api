import express from 'express'
import {
    addNewLesson,
    deleteLesson,
    getAllLessons,
    getCurrentLessonOrder,
    getLessonByCourseSlug,
    getLessonById,
    getLessonBySlug,
    getLessonWithUserProgress,
    getTotalLessonNumber,
    updateLesson,
} from '~/controllers/lessonController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const lessonRouter = express.Router()

lessonRouter.get('/', getAllLessons)
lessonRouter.get('/id/:id', getLessonById)
lessonRouter.get('/slug/:slug', getLessonBySlug)
lessonRouter.get('/:courseName', getLessonByCourseSlug)
lessonRouter.get('/getLessonWithUserProgress/:courseName', authenticateToken, getLessonWithUserProgress)
lessonRouter.get('/getLesson/:courseId/:chapterId', authenticateToken, getCurrentLessonOrder)
lessonRouter.get('/totalLesson/:courseId', getTotalLessonNumber)

lessonRouter.post('/addNewLesson', authenticateToken, addNewLesson)
lessonRouter.put('/updateLesson', authenticateToken, updateLesson)
lessonRouter.delete('/deleteLesson/:id', authenticateToken, deleteLesson)

export { lessonRouter }
