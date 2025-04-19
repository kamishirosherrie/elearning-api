import { submissionModel } from '~/models/submissionModel'
import { testSetModel } from '~/models/testSetModel'

export const getAllTestSet = async (req, res) => {
    try {
        const { userId } = req.user.userId

        const submission = await submissionModel.find({ userId: userId })

        const quizzeIdDone = submission.map((item) => item.quizzeId)
        const testSets = await testSetModel.find().populate('quizzes').lean()

        const result = testSets.map((item) => {
            const quizzeDone = item.quizzes.filter((quizze) => quizzeIdDone.includes(quizze._id.toString())).length
            return {
                ...item,
                totalQuizzes: item.quizzes.length,
                quizzeDone: quizzeDone,
            }
        })

        res.status(200).json({
            message: 'Get all test set successfully',
            result,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get all test set failed',
            error: error.message,
        })
    }
}
