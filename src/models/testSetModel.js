import mongoose from 'mongoose'

const testSetSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        slug: { type: String, slug: 'title', unique: true },
        skill: { type: String, enum: ['Listening', 'Reading', 'Writing', 'Speaking'], default: 'Reading' },
    },
    {
        timestamps: true,
    },
)

testSetSchema.virtual('quizzes', {
    ref: 'Quizzes',
    localField: '_id',
    foreignField: 'testSetId',
})

testSetSchema.set('toObject', { virtuals: true })
testSetSchema.set('toJSON', { virtuals: true })

export const testSetModel = mongoose.model('TestSets', testSetSchema, 'TestSets')
