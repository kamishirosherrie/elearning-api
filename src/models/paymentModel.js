import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    amount: { type: Number, required: true },
    orderInfo: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Courses' },
    transactionStatus: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
})

export const paymentModel = mongoose.model('Payments', paymentSchema, 'Payments')
