import { questionModel } from '~/models/questionModel'
import { quizzeModel } from '~/models/quizzeModel'

export const getAllQuestions = async (req, res) => {
    try {
        const questions = await questionModel.find()
        res.status(200).json({
            questions,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get all questions failed',
            error: error.message,
        })
    }
}

export const getQuestionByQuzzieSlug = async (req, res) => {
    try {
        const quizze = await quizzeModel.findOne({ slug: req.params.quizzeSlug })
        if (!quizze) {
            return res.status(400).json({
                message: 'Quizze not found',
            })
        }
        const questions = await questionModel.find({ quizzeId: quizze._id })
        if (!questions) {
            return res.status(400).json({
                message: 'Questions not found',
            })
        }

        res.status(200).json({
            message: 'Get questions by quizze successfully',
            questions,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get questions by quizze failed',
            error: error.message,
        })
    }
}

export const addNewQuestion = async (req, res) => {
    try {
        const quizze = await quizzeModel.findOne({ title: req.body.quizzeName })

        if (!quizze) {
            return res.status(400).json({
                message: 'Question type or quizze not found!',
            })
        }

        const { questions } = req.body
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                message: 'Questions are required!',
            })
        }

        const newQuestion = await questionModel.insertMany(
            questions.map((question) => ({
                question: question.question,
                questionTypeId: question.questionTypeId,
                quizzeId: quizze._id,
                answer: question.answer,
            })),
        )

        res.status(201).json({
            message: 'Add question successfully',
            newQuestion,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Add question failed',
            error: error.message,
        })
    }
}
