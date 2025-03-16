import { questionTypeModel } from '~/models/questionTypeModel'

export const getQuestionType = async (req, res) => {
    try {
        const questionTypes = await questionTypeModel.find()
        if (!questionTypes) {
            return res.status(400).json({
                message: 'Question type not found',
            })
        }

        return res.status(200).json({
            message: 'Get question type successfully',
            questionTypes,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Get question type failed',
            error: error.message,
        })
    }
}
