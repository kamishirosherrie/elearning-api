import { chapterModel } from '~/models/chapterModel'
import { courseModel } from '~/models/courseModel'
import { lessonModel } from '~/models/lessonModel'

export const getAllLessons = async (req, res) => {
    try {
        const lessons = await lessonModel
            .find()
            .populate({
                path: 'chapterId',
                populate: {
                    path: 'courseId',
                },
            })
            .sort({ order: 1 })
            .lean()
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

export const getLessonById = async (req, res) => {
    try {
        const lesson = await lessonModel
            .findById(req.params.id)
            .populate({
                path: 'chapterId',
                populate: {
                    path: 'courseId',
                },
            })
            .lean()
        if (!lesson) {
            return res.status(400).json({
                message: 'Lesson not found',
            })
        }

        res.status(200).json({
            message: 'Get lesson successfully',
            lesson,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get lesson failed',
            error: error.message,
        })
    }
}

export const getLessonBySlug = async (req, res) => {
    try {
        const lesson = await lessonModel
            .findOne({ slug: req.params.slug })
            .populate({
                path: 'chapterId',
                populate: {
                    path: 'courseId',
                },
            })
            .lean()
        if (!lesson) {
            return res.status(400).json({
                message: 'Lesson not found',
            })
        }

        res.status(200).json({
            message: 'Get lesson successfully',
            lesson,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get lesson failed',
            error: error.message,
        })
    }
}

export const getLessonByCourseSlug = async (req, res) => {
    try {
        const course = await courseModel.findOne({ slug: req.params.courseName }).lean()
        if (!course) {
            return res.status(400).json({
                message: 'Course not found',
            })
        }
        const chapters = await chapterModel.aggregate([
            { $match: { courseId: course._id } },
            {
                $lookup: {
                    from: 'Lessons',
                    localField: '_id',
                    foreignField: 'chapterId',
                    as: 'lessons',
                },
            },
            {
                $unwind: { path: '$lessons', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'Quizzes',
                    localField: 'lessons._id',
                    foreignField: 'lessonId',
                    as: 'lessons.quizzes',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    courseId: { $first: '$courseId' },
                    order: { $first: '$order' },
                    lessons: { $push: '$lessons' },
                },
            },
            { $sort: { order: 1 } },
        ])

        if (!chapters || chapters.length === 0) {
            return res.status(400).json({
                message: 'Chapters not found',
            })
        }

        res.status(200).json({
            message: 'Get lesson by course slug successfully',
            chapters,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get lesson by course slug failed',
            error: error.message,
        })
    }
}

export const getCurrentLessonOrder = async (req, res) => {
    try {
        const { courseId, chapterId } = req.params

        const chapter = await chapterModel
            .findOne({
                _id: chapterId,
                courseId: courseId,
            })
            .lean()

        if (!chapter) {
            return res.status(400).json({
                message: 'Chapter not found',
            })
        }

        const currentLessonOrder = await lessonModel.find({ chapterId: chapter._id }).countDocuments()

        res.status(200).json({
            message: 'Get current lesson order successfully',
            currentLessonOrder,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get current lesson order failed',
            error: error.message,
        })
    }
}

export const getTotalLessonNumber = async (req, res) => {
    try {
        const courseId = req.params.courseId

        if (!courseId) {
            return res.status(400).json({
                message: 'CourseId is required',
            })
        }

        const chapters = await chapterModel.find({ courseId }).select('_id').lean()
        if (!chapters || chapters.length === 0) {
            return res.status(404).json({
                message: 'No chapters found for this course',
            })
        }

        const chapterIds = chapters.map((chapter) => chapter._id)
        const totalLesson = await lessonModel.countDocuments({ chapterId: { $in: chapterIds } })

        res.status(200).json({
            message: 'Get total lesson number successfully',
            totalLesson,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get total lesson number failed',
            error: error.message,
        })
    }
}

export const addNewLesson = async (req, res) => {
    try {
        const lesson = req.body

        if (!lesson.title || !lesson.content) {
            return res.status(400).json({
                message: 'Title, Content is required',
            })
        }
        const chapter = await chapterModel.findOne({ _id: lesson.chapterId })
        if (!chapter) {
            return res.status(400).json({
                message: 'Chapter not found',
            })
        }

        const lessonOrder = await lessonModel.find({ chapterId: lesson.chapterId }).countDocuments()

        const newLesson = new lessonModel({
            title: lesson.title,
            content: lesson.content,
            order: lessonOrder + 1,
            chapterId: chapter._id,
        })

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

export const updateLesson = async (req, res) => {
    try {
        const lesson = await lessonModel.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true })

        if (!lesson) {
            return res.status(400).json({
                message: 'Lesson not found',
            })
        }

        res.status(200).json({
            message: 'Update lesson successfully',
            lesson,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Update lesson failed',
            error: error.message,
        })
    }
}

export const deleteLesson = async (req, res) => {
    try {
        const lesson = await lessonModel.findOne({ _id: req.params.id })
        if (!lesson) {
            return res.status(400).json({
                message: 'Lesson not found',
            })
        }

        await lessonModel.findByIdAndDelete(lesson._id)

        res.status(200).json({
            message: 'Delete lesson successfully',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Delete lesson failed',
            error: error.message,
        })
    }
}
