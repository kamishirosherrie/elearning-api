import { courseEnrollmentModel } from '~/models/courseEnrollmentModel'
import { courseModel } from '~/models/courseModel'

// [GET]
export const getCourses = async (req, res) => {
    try {
        const courses = await courseModel.find()
        res.status(200).json({
            message: 'Get courses successfully',
            courses,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get courses failed',
            error: error.message,
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.id)
        res.status(200).json({
            message: 'Get course by ID successfully',
            course,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get course by ID failed',
            error: error.message,
        })
    }
}

export const getCourseEnrollments = async (req, res) => {
    try {
        const courseEnrollments = await courseEnrollmentModel.find()
        res.status(200).json({
            message: 'Get course enrollments successfully',
            courseEnrollments,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get course enrollments failed',
            error: error.message,
        })
    }
}
// [POST]
export const addNewCourse = async (req, res) => {
    try {
        const course = req.body
        if (!course.title) {
            return res.status(400).json({
                message: 'Title is required',
            })
        }
        const newCourse = new courseModel(course)
        await newCourse.save()

        res.status(201).json({
            message: 'Add new course successfully',
            course: newCourse,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Add new course failed',
            error: error.message,
        })
    }
}

export const addCourseEnrollment = async (req, res) => {
    try {
        const { courseId, userId } = req.body
        if (!courseId || !userId) {
            return res.status(400).json({
                message: 'Course ID and User ID are required',
            })
        }
        const newCourseEnrollment = new courseEnrollmentModel({ courseId, userId })
        await newCourseEnrollment.save()

        res.status(201).json({
            message: 'Add new course enrollment successfully',
            courseEnrollment: newCourseEnrollment,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Add new course enrollment failed',
            error: error.message,
        })
    }
}

// [PUT]
export const updateCourse = async (req, res) => {
    try {
        const course = await courseModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
            })
        }
        res.status(200).json({
            message: 'Update course successfully',
            course,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Update course failed',
            error: error.message,
        })
    }
}

// [DELETE]
export const deleteCourse = async (req, res) => {
    try {
        const course = await courseModel.findByIdAndDelete(req.params.id)
        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
            })
        }
        res.status(200).json({
            message: 'Delete course successfully',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Delete course failed',
            error: error.message,
        })
    }
}
