import { questionModel } from '~/models/questionModel'
import { questionTypeModel } from '~/models/questionTypeModel'
import { quizzeModel } from '~/models/quizzeModel'
import { submissionModel } from '~/models/submissionModel'
import { userModel } from '~/models/userModel'

export const submitQuiz = async (req, res) => {
    try {
        const { quizzeId, userId, answers } = req.body

        if (!quizzeId || userId || !Array.isArray(answers)) return res.status(400).json({ message: 'Required input' })
        const quizze = await quizzeModel.findOne({ _id: quizzeId }).lean()
        if (!quizze) {
            return res.status(400).json({
                message: 'Quizze not found',
            })
        }

        const user = await userModel.findOne({ _id: userId }).lean()
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            })
        }

        const questionTypes = await questionTypeModel.find().lean()

        let score = 0
        const submittedAnswers = []
        for (const answer of req.body.answers) {
            // get question from db
            const question = await questionModel.findById(answer.questionId).lean()

            if (!question) continue

            let isCorrect = false

            switch (question.questionTypeId) {
                case questionTypes[0]._id:
                    const correctAnswer = question.answer.find((a) => a.isCorrect === true)
                    if (answer.text === correctAnswer.text) {
                        score += 1
                        isCorrect = true
                    }
                    break
                case questionTypes[2]._id:
                    if (question.answer.text.includes(answer.text)) {
                        score += 1
                        isCorrect = true
                    }
                    break
                case questionTypes[3]._id:
                    if (answer.text === question.answer.text) {
                        score += 1
                        isCorrect = true
                    }
                    break
            }

            submittedAnswers.push({ ...answer, isCorrect })
        }

        const submission = new submissionModel({
            ...req.body,
            quizzeId: quizze._id,
            userId: user._id,
            score,
            answers: submittedAnswers,
        })
        await submission.save()

        res.status(200).json({
            message: 'Submit quiz successfully',
            submission,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Submit quiz failed',
            error: error.message,
        })
    }
}

export const getSubmissions = async (req, res) => {
    try {
        const submissions = await submissionModel.find().populate('quizzeId').populate('userId')
        if (!submissions || submissions.length === 0) {
            return res.status(400).json({
                message: 'Submissions not found',
            })
        }
        res.status(200).json({
            message: 'Get submissions successfully',
            submissions,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get submissions failed',
            error: error.message,
        })
    }
}

export const getSubmissionsByUserId = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.userId })
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            })
        }

        const submissions = await submissionModel.find({ userId: user._id }).populate('quizzeId').populate('userId')
        if (!submissions || submissions.length === 0) {
            return res.status(400).json({
                message: 'Submissions not found',
            })
        }

        res.status(200).json({
            message: 'Get submissions successfully',
            submissions,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get submissions failed',
            error: error.message,
        })
    }
}
