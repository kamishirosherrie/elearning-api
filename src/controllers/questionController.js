import { questionModel } from '~/models/questionModel'
import { questionTypeModel } from '~/models/questionTypeModel'
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

export const addNewQuestion = async (req, res) => {
    try {
        const questionType = await questionTypeModel.findOne({ _id: req.body.questionTypeId })
        const quizze = await quizzeModel.findOne({ _id: req.body.quizzeId })

        if (!questionType || !quizze) {
            return res.status(400).json({
                message: 'Question type or quizze not found!',
            })
        }

        const question = req.body
        if (!question.question || !question.answer) {
            return res.status(400).json({
                message: 'Question and answer are required!',
            })
        }

        const newQuestion = new questionModel({ ...question, quizzeId: quizze._id, questionTypeId: questionType._id })
        await newQuestion.save()

        res.status(200).json({
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
