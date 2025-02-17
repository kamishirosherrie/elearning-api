import mongoose from 'mongoose'

const quizzeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        lessonId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lessons' },
    },
    {
        timestamps: true,
    },
)

export const quizzeModel = mongoose.model('Quizzes', quizzeSchema, 'Quizzes')
