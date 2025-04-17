import { lessonModel } from '~/models/lessonModel'
import { quizzeModel } from '~/models/quizzeModel'

export const getAllQuizze = async (req, res) => {
    try {
        const quizzes = await quizzeModel
            .find()
            .populate({
                path: 'lessonId',
                select: 'title',
                populate: {
                    path: 'chapterId',
                    select: 'title',
                    populate: {
                        path: 'courseId',
                        select: 'title',
                    },
                },
            })
            .lean()
        res.status(200).json({
            message: 'Get all quizzes successfully',
            quizzes,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get all quizzes failed',
            error: error.message,
        })
    }
}

export const getQuizzeByType = async (req, res) => {
    try {
        const { type } = req.params
        if (!['lesson', 'entrytest', 'testpractice'].includes(type)) {
            return res.status(400).json({
                message: 'Type is not valid',
            })
        }
        const quizzes = await quizzeModel.find({ type: type })
        if (!quizzes) {
            return res.status(400).json({
                message: 'Quizzes not found',
            })
        }

        res.status(200).json({
            message: 'Get quizzes by type successfully',
            quizzes,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get quizzes by type failed',
            error: error.message,
        })
    }
}

export const getQuizzeBySlug = async (req, res) => {
    try {
        const quizze = await quizzeModel.findOne({ slug: req.params.slug }).populate('lessonId')
        if (!quizze) {
            return res.status(400).json({
                message: 'Quizze not found',
            })
        }

        res.status(200).json({
            message: 'Get quizze successfully',
            quizze,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get quizze failed',
            error: error.message,
        })
    }
}

export const getQuizzeByLessonSlug = async (req, res) => {
    try {
        const lesson = await lessonModel.findOne({ slug: req.params.lessonSlug })
        if (!lesson) {
            return res.status(400).json({
                message: 'Lesson not found',
            })
        }
        const quizze = await quizzeModel.findOne({ lessonId: lesson._id })
        if (!quizze) {
            return res.status(400).json({
                message: 'Quizze not found',
            })
        }
        res.status(200).json({
            message: 'Get quizze successfully',
            quizze,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get quizze failed',
            error: error.message,
        })
    }
}

export const addNewQuizze = async (req, res) => {
    try {
        const quizze = req.body
        if (!quizze.title) {
            return res.status(400).json({
                message: 'Title is required',
            })
        }

        if (quizze.type === 'lesson') {
            const lesson = await lessonModel.findOne({ title: req.body.lessonName })
            if (!lesson) {
                return res.status(400).json({
                    message: 'Lesson not found',
                })
            }
            const newQuizze = new quizzeModel({ ...quizze, lessonId: lesson._id })
            await newQuizze.save()
            res.status(200).json({
                message: 'Add quizze successfully',
                newQuizze,
            })
        } else {
            const newQuizze = new quizzeModel({ ...quizze, lessonId: null })
            await newQuizze.save()
            res.status(200).json({
                message: 'Add quizze successfully',
                newQuizze,
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Add quizze failed',
            error: error.message,
        })
    }
}

export const deleteQuizze = async (req, res) => {
    try {
        const quizze = await quizzeModel.findOne({ _id: req.params.id })
        if (!quizze) {
            return res.status(400).json({
                message: 'Quizze not found',
            })
        }

        await quizzeModel.findByIdAndDelete(quizze._id)

        res.status(200).json({
            message: 'Delete quizze successfully',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Delete quizze failed',
            error: error.message,
        })
    }
}
