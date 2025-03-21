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

const courseRouter = express.Router()

courseRouter.get('/', getCourses)
courseRouter.get('/:id', getCourseById)
courseRouter.get('/slug/:slug', getCourseBySlug)
courseRouter.get('/enrollment', getCourseEnrollments)

courseRouter.post('/addCourse', addNewCourse)
courseRouter.post('/addCourse/enrollment', addCourseEnrollment)

courseRouter.put('/updateCourse', updateCourse)

courseRouter.delete('/deleteCourse/:id', deleteCourse)

export { courseRouter }
