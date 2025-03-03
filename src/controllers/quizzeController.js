import { lessonModel } from '~/models/lessonModel'
import { quizzeModel } from '~/models/quizzeModel'

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
