import express from 'express'
import { submitQuiz } from '~/controllers/submissionController'

const submissionRoutes = express.Router()

submissionRoutes.post('/submit', submitQuiz)

export { submissionRoutes }
