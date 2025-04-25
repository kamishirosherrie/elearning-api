import { lessonModel } from '~/models/lessonModel'
import { lessonProgressModel } from '~/models/lessonProgressModel'
import { userModel } from '~/models/userModel'

export const getCourseProgress = async (req, res) => {
    try {
        const { userId } = req.user

        if (!userId) {
            return res.status(400).json({
                message: 'UserId is required',
            })
        }

        const lessons = await lessonProgressModel.aggregate([
            {
                $group: {
                    _id: '$courseId',
                    totalLessons: { $sum: 1 },
                    lessonIds: { $push: '$_id' },
                },
            },
        ])

        if (!lessons || lessons.length === 0) {
            return res.status(400).json({
                message: 'No lessons found',
            })
        }

        const completedLessons = await lessonProgressModel.find({ userId, isCompleted: true }).lean()
        const courseProgress = lessons.map((course) => {
            const completedCount = completedLessons.filter((progress) =>
                course.lessonIds.includes(progress.lessonId.toString()),
            ).length

            const completionPercentage = course.totalLessons > 0 ? (completedCount / course.totalLessons) * 100 : 0

            return {
                totalLessons: course.totalLessons,
                completedCount,
                completionPercentage: Math.round(completionPercentage),
            }
        })

        res.status(200).json({
            message: 'Get course progress successfully',
            courseProgress,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get course progress failed',
            error: error.message,
        })
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

        const lesson = await lessonModel.findById(lessonId)
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
        } else {
            lessonProgress = new lessonProgressModel({
                userId: userId,
                lessonId: lessonId,
                isCompleted: true,
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
