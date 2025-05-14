import express from 'express'
import { createOrder, paymentReturn } from '~/controllers/paymentController'

const paymentRouter = express.Router()

paymentRouter.get('/result', paymentReturn)
paymentRouter.post('/create', createOrder)

export { paymentRouter }
