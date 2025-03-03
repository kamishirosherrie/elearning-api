import { courseModel } from '~/models/courseModel'
import { lessonModel } from '~/models/lessonModel'

// [GET LESSONS]
export const getAllLessons = async (req, res) => {
    try {
        const lessons = await lessonModel.find()
        res.status(200).json({
            message: 'Get lessons successfully',
            lessons,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get lessons failed',
            error: error.message,
        })
    }
}

// [GET LESSON BY COURSE]
export const getLessonByCourse = async (req, res) => {
    try {
        const course = await courseModel.findOne({ title: req.params.courseName })
        if (!course) {
            return res.status(400).json({
                message: 'Course not found',
            })
        }

        const lessons = await lessonModel.find({ courseId: course._id })
        res.status(200).json({
            message: 'Get lessons by course successfully',
            lessons: lessons,
            courseSlug: course.slug,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get lessons by course failed',
            error: error.message,
        })
    }
}

// [INSERT LESSON]
export const addNewLesson = async (req, res) => {
    try {
        const course = await courseModel.findOne({ title: req.body.courseName })
        if (!course) {
            return res.status(400).json({
                message: 'Course not found',
            })
        }

        const lesson = req.body
        if (!lesson.title || !lesson.content) {
            return res.status(400).json({
                message: 'Title, Content is required',
            })
        }

        const newLesson = new lessonModel({ ...lesson, courseId: course._id })
        await newLesson.save()

        res.status(200).json({
            message: 'Add lesson successfully',
            newLesson,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Add lesson failed',
            error: error.message,
        })
    }
}
