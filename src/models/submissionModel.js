import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema(
    {
        score: { type: Number, required: true },
        submittedAt: { type: Date, required: true, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
        quizzeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quizzes' },
    },
    {
        timestamps: true,
    },
)

export const submissionModel = mongoose.model('Submissions', submissionSchema, 'Submissions')
