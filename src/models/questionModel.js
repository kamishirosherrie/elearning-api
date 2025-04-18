import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        questionTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionTypes', required: true },
        quizzeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quizzes' },
        answer: [{ isCorrect: { type: Boolean, required: true }, text: { type: String, required: true } }],
        part: { type: String, default: '' },
        context: { type: String, default: '' },
    },
    {
        timestamps: true,
    },
)

export const questionModel = mongoose.model('Questions', questionSchema, 'Questions')
