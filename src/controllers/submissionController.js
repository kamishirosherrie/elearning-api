import { questionModel } from '~/models/questionModel'
import { questionTypeModel } from '~/models/questionTypeModel'
import { quizzeModel } from '~/models/quizzeModel'
import { submissionModel } from '~/models/submissionModel'
import { userModel } from '~/models/userModel'
import { evaluateWriting } from '~/utils/openai'
import { getRankTitle } from '~/utils/rankTitle'

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

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: 'You must answer at least one question.' })
        }

        const quizze = await quizzeModel.findById(quizzeId).lean()
        if (!quizze) {
            return res.status(400).json({
                message: 'Quiz not found',
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
                message: 'Questions not found',
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
            const question = questionMap.get(answer?.questionId.toString())

            if (!question) continue

            let isCorrect = false

            switch (question.questionTypeId.toString()) {
                case questionTypes[0]._id.toString():
                    const correctAnswer = question.answer?.find((a) => a.isCorrect === true)

                    if (correctAnswer && answer.text === correctAnswer.text) {
                        score += 1
                        isCorrect = true
                    }
                    break
                case questionTypes[2]._id.toString():
                    if (question.answer?.text?.includes(answer.text)) {
                        score += 1
                        isCorrect = true
                    }
                    break
                case questionTypes[3]._id.toString():
                    const userAnswer = answer.text?.trim().toLowerCase()
                    const correctAnswers = question.answer?.map((ans) => ans.text.trim().toLowerCase())
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

export const submitWriting = async (req, res) => {
    try {
        const { userId, quizzeId, answers, timeTaken } = req.body

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: 'Answers are required.' })
        }

        const aiResult = await evaluateWriting(answers)
        const submission = new submissionModel({
            userId,
            quizzeId,
            answers: answers.map((ans, index) => ({
                questionId: ans.questionId,
                text: ans.text,
                aiScore: aiResult.results[index].score,
                aiFeedback: aiResult.results[index].feedback,
                isCorrect: aiResult.results[index].score >= 5,
            })),
            score: aiResult.totalScore,
            timeTaken: timeTaken || 0,
        })

        await submission.save()

        res.status(201).json({
            message: 'Writing submission successful',
            submission,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to submit writing', error: err.message })
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
        const { page = 1, limit = 10 } = req.query

        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            })
        }

        const submissions = await submissionModel
            .find({ userId: user._id })
            .populate({
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
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))

        const total = await submissionModel.countDocuments({ userId: user._id })

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
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
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

export const getGlobalRanking = async (req, res) => {
    try {
        const submissions = await submissionModel.aggregate([
            {
                $group: {
                    _id: { userId: '$userId', quizzeId: '$quizzeId' },
                    bestScore: { $max: '$score' },
                },
            },
            {
                $group: {
                    _id: '$_id.userId',
                    totalScore: { $sum: '$bestScore' },
                    quizzeCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $sort: {
                    totalScore: -1,
                    quizzeCount: -1,
                },
            },
            {
                $limit: 50,
            },
        ])

        const rankingWithRank = submissions.map((submission, index) => ({
            ...submission,
            rankTitle: getRankTitle(submission.totalScore),
        }))

        res.status(200).json({
            message: 'Get global ranking successfully',
            rankingWithRank,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get global ranking failed',
            error: error.message,
        })
    }
}
