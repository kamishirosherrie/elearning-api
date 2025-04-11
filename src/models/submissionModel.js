import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema(
    {
        score: { type: Number, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
        quizzeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quizzes' },
        answers: [
            {
                questionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Questions' },
                answerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Answers' },
                isCorrect: { type: Boolean, required: true },
            },
        ],
        timeTaken: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
)

export const submissionModel = mongoose.model('Submissions', submissionSchema, 'Submissions')
