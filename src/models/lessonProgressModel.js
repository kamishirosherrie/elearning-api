import mongoose from 'mongoose'

const lessonProgressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true })

export const lessonProgressModel = mongoose.model('LessonProgresses', lessonProgressSchema, 'LessonProgresses')
