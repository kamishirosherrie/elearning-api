import { quizzeModel } from '~/models/quizzeModel'
import { submissionModel } from '~/models/submissionModel'
import { userModel } from '~/models/userModel'

export const submitQuiz = async (req, res) => {
    try {
        const quizze = await quizzeModel.findOne({ _id: req.body.quizzeId })
        if (!quizze) {
            return res.status(400).json({
                message: 'Quizze not found',
            })
        }

        const user = await userModel.findOne({ _id: req.body.userId })
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            })
        }

        const submission = new submissionModel({
            ...req.body,
            quizzeId: quizze._id,
            userId: user._id,
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
