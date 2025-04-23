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

export const getCourseBySlug = async (req, res) => {
    try {
        const course = await courseModel.findOne({ slug: req.params.slug })
        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
            })
        }
        res.status(200).json({
            message: 'Get course by slug successfully',
            course,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get course by slug failed',
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
        const courseEnrollments = await courseEnrollmentModel.find().populate('courseId', 'title').populate('userId')
        if (!courseEnrollments) {
            return res.status(404).json({
                message: 'Course enrollments not found',
            })
        }
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

export const getCourseEnrollmentsById = async (req, res) => {
    try {
        const { userId, courseId } = req.query

        const courseEnrollment = await courseEnrollmentModel.findOne({ userId, courseId })

        if (!courseEnrollment || courseEnrollment.length === 0) {
            return res.status(404).json({
                message: 'You have not enrolled this course yet.',
            })
        }

        res.status(200).json({
            message: 'Get course enrollments successfully',
            courseEnrollment,
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
                message: 'Id khóa học và Id người dùng là bắt buộc',
            })
        }

        const courseEnrollment = await courseEnrollmentModel.findOne({ courseId, userId })
        if (courseEnrollment) {
            return res.status(400).json({
                message: 'Bạn đã đăng kí khóa học này rồi',
            })
        }

        const newCourseEnrollment = new courseEnrollmentModel({ courseId, userId })
        await newCourseEnrollment.save()

        res.status(201).json({
            message: 'Đăng kí khóa học thành công',
            courseEnrollment: newCourseEnrollment,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Đăng kí khóa học thất bại',
            error: error.message,
        })
    }
}

// [PUT]
export const updateCourse = async (req, res) => {
    try {
        const course = await courseModel.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true })
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
