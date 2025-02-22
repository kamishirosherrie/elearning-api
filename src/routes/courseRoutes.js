import express from 'express'
import {
    addCourseEnrollment,
    addNewCourse,
    deleteCourse,
    getCourseById,
    getCourseEnrollments,
    getCourses,
    updateCourse,
} from '~/controllers/courseController'

const courseRouter = express.Router()

courseRouter.get('/', getCourses)
courseRouter.get('/:id', getCourseById)
courseRouter.get('/enrollment', getCourseEnrollments)

courseRouter.post('/addCourse', addNewCourse)
courseRouter.post('/addCourse/enrollment', addCourseEnrollment)

courseRouter.put('/updateCourse/:id', updateCourse)

courseRouter.delete('/deleteCourse/:id', deleteCourse)

export { courseRouter }
