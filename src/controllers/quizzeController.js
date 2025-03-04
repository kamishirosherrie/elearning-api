import { lessonModel } from '~/models/lessonModel'
import { quizzeModel } from '~/models/quizzeModel'

export const getQuizzeByLesson = async (req, res) => {
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
