import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { env } from './config/environment'
import { roleRouter } from './routes/v1/roleRoutes'
import { courseRouter } from './routes/v1/courseRoutes'
import { authRouter } from './routes/v1/authRoutes'
import { userRouter } from './routes/v1/userRoutes'
import { lessonRouter } from './routes/v1/lessonRoutes'
import { quizzeRouter } from './routes/v1/quizzeRoutes'
import { questionRouter } from './routes/v1/questionRoutes'
import { questionTypeRouter } from './routes/v1/questionTypeRoutes'
import { submissionRoutes } from './routes/v1/submissionRoutes'
import { authenticateToken } from './middlewares/authenticateToken'
import { chapterRouter } from './routes/v1/chapterRoutes'
import { testSetRouter } from './routes/v1/testSetRouter'
import { lessonProgressRouter } from './routes/v1/lessonProgressRouter'
import { aiRouter } from './routes/v1/aiRoutes'
import { postRouter } from './routes/v1/postRouter'
import { commentRouter } from './routes/v1/commentRouter'
import './cron/dailyReminder'
import { paymentRouter } from './routes/v1/paymentRouter'

const START_SERVER = () => {
    const app = express()

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cookieParser())

    app.use(
        cors({
            origin: env.ORIGIN?.split(',') || [],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        }),
    )

    app.get('/', (req, res) => {
        res.send('Home Page')
    })

    app.listen(env.PORT, env.HOST, () => {
        console.log(`Hello ${env.AUTHOR}, I'm running at http://${env.HOST}:${env.PORT}`)
    })

    app.use('/role', authenticateToken, roleRouter)

    app.use('/auth', authRouter)

    app.use('/user', authenticateToken, userRouter)

    app.use('/course', courseRouter)

    app.use('/chapter', authenticateToken, chapterRouter)

    app.use('/lesson', lessonRouter)

    app.use('/progress', authenticateToken, lessonProgressRouter)

    app.use('/testset', authenticateToken, testSetRouter)

    app.use('/quizze', authenticateToken, quizzeRouter)

    app.use('/question', authenticateToken, questionRouter)

    app.use('/questionType', authenticateToken, questionTypeRouter)

    app.use('/submission', submissionRoutes)

    app.use('/ai', authenticateToken, aiRouter)

    app.use('/post', postRouter)

    app.use('/comment', commentRouter)

    app.use('/payment', paymentRouter)
}

;(async () => {
    try {
        await mongoose.connect(env.MONGODB_URI)
        console.log('App connected to database')
        START_SERVER()
    } catch (error) {
        console.log(error)
        process.exit(0)
    }
})()
