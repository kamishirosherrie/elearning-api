import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: false },
        shortDescription: { type: String, required: false },
        fullDescription: { type: String, required: false },
        price: { type: Number, required: true },
        slug: {
            type: String,
            slug: 'title',
            unique: true,
            forceIdSlug: false,
            slugOn: { updateOne: true, save: true },
        },
        totalLesson: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
)

export const courseModel = mongoose.model('Courses', courseSchema, 'Courses')
