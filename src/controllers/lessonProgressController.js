import { courseEnrollmentModel } from '~/models/courseEnrollmentModel'
import { lessonModel } from '~/models/lessonModel'
import { lessonProgressModel } from '~/models/lessonProgressModel'
import { userModel } from '~/models/userModel'

export const getLessonProgress = async (req, res) => {
    try {
        const { userId } = req.user

        const courseEnrollments = await courseEnrollmentModel.find({ userId }).populate('courseId')
        if (!courseEnrollments || courseEnrollments.length === 0) {
            return res.status(400).json({ message: 'No course enrollments found' })
        }

        const courses = courseEnrollments.map((enrollment) => enrollment.courseId)

        if (!courses || courses.length === 0) {
            return res.status(400).json({ message: 'No courses found' })
        }

        const courseProgressPromises = courses.map(async (course) => {
            const completedLessons = await lessonProgressModel.countDocuments({
                userId,
                courseId: course._id,
                isCompleted: true,
            })

            const completionPercentage = course.totalLesson > 0 ? (completedLessons / course.totalLesson) * 100 : 0

            return {
                courseId: course._id,
                courseTitle: course.title,
                courseSlug: course.slug,
                totalLessons: course.totalLesson,
                completedLessons,
                completionPercentage: Math.round(completionPercentage),
            }
        })

        const courseProgress = await Promise.all(courseProgressPromises)

        res.status(200).json({
            message: 'Course progress fetched successfully',
            courseProgress,
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course progress', error: error.message })
    }
}

export const markLessonCompleted = async (req, res) => {
    try {
        const { userId } = req.user
        const lessonId = req.params.lessonId

        if (!userId || !lessonId) {
            return res.status(400).json({
                message: 'UserId and lessonId is required',
            })
        }

        const lesson = await lessonModel.findById(lessonId).populate({
            path: 'chapterId',
            populate: {
                path: 'courseId',
            },
        })
        if (!lesson) {
            return res.status(400).json({
                message: 'Lesson not found',
            })
        }

        const user = await userModel.findOne({ _id: userId }).lean()
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            })
        }

        let lessonProgress = await lessonProgressModel.findOne({
            userId: userId,
            lessonId: lessonId,
        })

        if (lessonProgress) {
            lessonProgress.isCompleted = true
            lessonProgress.userId = userId
            lessonProgress.lessonId = lessonId
            lessonProgress.courseId = lesson.chapterId.courseId._id
        } else {
            lessonProgress = new lessonProgressModel({
                userId: userId,
                lessonId: lessonId,
                isCompleted: true,
                courseId: lesson.chapterId.courseId._id,
            })
        }

        await lessonProgress.save()
        res.status(200).json({
            message: 'Mark lesson completed successfully',
            lesson: lessonProgress,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Mark lesson completed failed',
            error: error.message,
        })
    }
}
