import { lessonModel } from '~/models/lessonModel'
import { quizzeModel } from '~/models/quizzeModel'

export const getAllQuizze = async (req, res) => {
    try {
        const quizzes = await quizzeModel.find()
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

export const getQuizzesWithQuestions = async (req, res) => {
    try {
        const quizzesWithQuestons = await quizzeModel.aggregate([
            {
                $lookup: {
                    from: 'Questions',
                    localField: '_id',
                    foreignField: 'quizzeId',
                    as: 'questions',
                },
            },
            {
                $lookup: {
                    from: 'Lessons',
                    localField: 'lessonId',
                    foreignField: '_id',
                    as: 'lesson',
                },
            },
            {
                $unwind: '$lesson',
            },
        ])

        res.status(200).json({
            message: 'Get quizzes with questions successfully',
            quizzesWithQuestons,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get quizzes with questions failed',
            error: error.message,
        })
    }
}

export const addNewQuizze = async (req, res) => {
    try {
        const lesson = await lessonModel.findOne({ title: req.body.lessonName })
        if (!lesson) {
            return res.status(400).json({
                message: 'Lesson not found',
            })
        }

        const quizze = req.body
        if (!quizze.title) {
            return res.status(400).json({
                message: 'Title is required',
            })
        }

        const newQuizze = new quizzeModel({ ...quizze, lessonId: lesson._id })
        await newQuizze.save()

        res.status(200).json({
            message: 'Add quizze successfully',
            newQuizze,
        })
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
