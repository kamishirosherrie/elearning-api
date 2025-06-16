import express from 'express'
import { createOrder, paymentReturn } from '~/controllers/paymentController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const paymentRouter = express.Router()

paymentRouter.get('/result', authenticateToken, paymentReturn)
paymentRouter.post('/create', authenticateToken, createOrder)

export { paymentRouter }
