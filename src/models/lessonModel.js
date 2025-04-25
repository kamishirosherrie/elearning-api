import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const lessonSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        order: { type: Number, required: true },
        content: { type: String, required: true, default: '' },
        slug: {
            type: String,
            slug: 'title',
            unique: true,
            forceIdSlug: false,
            slugOn: { updateOne: true, save: true },
        },
        chapterId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chapters' },
    },
    {
        timestamps: true,
    },
)

export const lessonModel = mongoose.model('Lessons', lessonSchema, 'Lessons')
