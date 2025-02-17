import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        quizzeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quizzes' },
        questionTypeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'QuestionTypes' },
    },
    {
        timestamps: true,
    },
)

export const questionModel = mongoose.model('Questions', questionSchema, 'Questions')
