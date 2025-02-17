import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        videoUrl: { type: String, required: false },
        courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Courses' },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    },
    {
        timestamps: true,
    },
)

export const lessonModel = mongoose.model('Lessons', lessonSchema, 'Lessons')
