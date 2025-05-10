import express from 'express'
import { createOrder, paymentReturn } from '~/controllers/paymentController'

const paymentRouter = express.Router()

paymentRouter.post('/create', createOrder)
paymentRouter.get('/payment/return', paymentReturn)

export { paymentRouter }
