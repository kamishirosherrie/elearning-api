import { questionModel } from '~/models/questionModel'
import { questionTypeModel } from '~/models/questionTypeModel'
import { quizzeModel } from '~/models/quizzeModel'
import { submissionModel } from '~/models/submissionModel'
import { userModel } from '~/models/userModel'

const formatTime = (time) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
    ].join(':')
}

export const submitQuiz = async (req, res) => {
    try {
        const { quizzeId, userId, timeTaken, answers } = req.body

        if (!quizzeId) {
            return res.status(400).json({ message: 'Quiz ID is required' })
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({ message: 'Answers are required' })
        }

        const quizze = await quizzeModel.findById(quizzeId).lean()
        if (!quizze) {
            return res.status(400).json({
                message: 'Quizze not found',
            })
        }

        const user = await userModel.findById(userId).lean()
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            })
        }

        const questionIds = answers.map((answer) => answer.questionId)

        const questions = await questionModel.find({ _id: { $in: questionIds } }).lean()

        if (!questions || questions.length === 0) {
            return res.status(400).json({
                message: 'Question not found',
            })
        }

        const questionTypes = await questionTypeModel.find().lean()

        const questionMap = new Map()
        questions.forEach((question) => {
            questionMap.set(question._id.toString(), question)
        })

        let score = 0
        const submittedAnswers = []
        for (const answer of answers) {
            const question = questionMap.get(answer.questionId.toString())

            if (!question) continue

            let isCorrect = false

            switch (question.questionTypeId.toString()) {
                case questionTypes[0]._id.toString():
                    const correctAnswer = question.answer.find((a) => a.isCorrect === true)

                    if (correctAnswer && answer.text === correctAnswer.text) {
                        score += 1
                        isCorrect = true
                    }
                    break
                case questionTypes[2]._id.toString():
                    if (question.answer.text.includes(answer.text)) {
                        score += 1
                        isCorrect = true
                    }
                    break
                case questionTypes[3]._id.toString():
                    const userAnswer = answer.text.trim().toLowerCase()
                    const correctAnswers = question.answer.map((ans) => ans.text.trim().toLowerCase())
                    if (correctAnswers.includes(userAnswer)) {
                        score += 1
                        isCorrect = true
                    }
                    break
                default:
                    break
            }

            submittedAnswers.push({ ...answer, isCorrect })
        }

        const submission = new submissionModel({
            quizzeId: quizze._id,
            userId: user._id,
            score,
            timeTaken: timeTaken || 0,
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

        const formattedSubmissions = submissions.map((submission) => ({
            ...submission.toObject(),
            timeTaken: formatTime(submission.timeTaken),
        }))

        res.status(200).json({
            message: 'Get submissions successfully',
            submissions: formattedSubmissions,
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

        const submissions = await submissionModel.find({ userId: user._id }).populate({
            path: 'quizzeId',
            select: 'title slug',
            populate: {
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
            },
        })
        if (!submissions || submissions.length === 0) {
            return res.status(400).json({
                message: 'Submissions not found',
            })
        }

        const formattedSubmissions = submissions.map((submission) => ({
            ...submission.toObject(),
            timeTaken: formatTime(submission.timeTaken),
        }))

        res.status(200).json({
            message: 'Get submissions successfully',
            submissions: formattedSubmissions,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get submissions failed',
            error: error.message,
        })
    }
}

export const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params

        const submission = await submissionModel.findOne({ _id: id })

        return res.status(200).json({
            message: 'Get submission successfully',
            submission,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get submission failed',
            error: error.message,
        })
    }
}
