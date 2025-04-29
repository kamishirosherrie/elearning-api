import mongoose from 'mongoose'

const lessonProgressSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lessons', required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true })

export const lessonProgressModel = mongoose.model('LessonProgresses', lessonProgressSchema, 'LessonProgresses')
