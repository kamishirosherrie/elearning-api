import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    orderInfo: { type: String, required: true },
    transactionStatus: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
})

export const paymentModel = mongoose.model('Payments', paymentSchema, 'Payments')
