import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Questions' },
    },
    {
        timestamps: true,
    },
)

export const aswerModel = mongoose.model('Answers', answerSchema, 'Answers')
