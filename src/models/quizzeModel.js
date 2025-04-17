import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const quizzeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: false },
        time: { type: Number, required: true },
        slug: {
            type: String,
            slug: 'title',
            unique: true,
            forceIdSlug: false,
            slugOn: { updateOne: true, save: true },
        },
        lessonId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Lessons' },
        type: { type: String, enum: ['lesson', 'entrytest', 'testpractice'], default: 'lesson' },
    },
    {
        timestamps: true,
    },
)

export const quizzeModel = mongoose.model('Quizzes', quizzeSchema, 'Quizzes')
