import express from 'express'
import {
    addCourseEnrollment,
    addNewCourse,
    deleteCourse,
    getCourseById,
    getCourseBySlug,
    getCourseEnrollments,
    getCourses,
    updateCourse,
} from '~/controllers/courseController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const courseRouter = express.Router()

courseRouter.get('/', getCourses)
courseRouter.get('/:id', getCourseById)
courseRouter.get('/slug/:slug', getCourseBySlug)
courseRouter.get('/getCourse/enrollment', authenticateToken, getCourseEnrollments)

courseRouter.post('/addCourse', authenticateToken, addNewCourse)
courseRouter.post('/addCourse/enrollment', authenticateToken, addCourseEnrollment)

courseRouter.put('/updateCourse', authenticateToken, updateCourse)

courseRouter.delete('/deleteCourse/:id', authenticateToken, deleteCourse)

export { courseRouter }
