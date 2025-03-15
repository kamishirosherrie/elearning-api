import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
    {
        question: { type: String, required: true, unique: true },
        questionType: { type: String, required: true },
        quizzeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quizzes' },
        answer: [{ isCorrect: { type: Boolean, required: true }, text: { type: String, required: true } }],
    },
    {
        timestamps: true,
    },
)

export const questionModel = mongoose.model('Questions', questionSchema, 'Questions')
