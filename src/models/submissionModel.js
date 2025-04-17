import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema(
    {
        score: { type: Number, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
        quizzeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quizzes' },
        answers: [
            {
                text: { type: String, default: '' },
                questionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Questions' },
                isCorrect: { type: Boolean, required: true },
                speakingAudioUrl: { type: String, default: '' },
                aiScore: { type: Number, default: 0 },
                aiFeedback: { type: String, default: '' },
            },
        ],
        timeTaken: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
)

export const submissionModel = mongoose.model('Submissions', submissionSchema, 'Submissions')
