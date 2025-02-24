import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { env } from './config/environment'
import { roleRouter } from './routes/roleRoutes'
import { courseRouter } from './routes/courseRoutes'
import { authRouter } from './routes/authRoutes'

const START_SERVER = () => {
    const app = express()

    app.use(express.json())

    app.use(
        cors({
            origin: env.ORIGIN,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type'],
            credentials: true,
        }),
    )

    app.get('/', (req, res) => {
        res.send('Home Page')
    })

    app.listen(env.APP_PORT, env.APP_HOST, () => {
        console.log(`Hello ${env.AUTHOR}, I'm running at http://${env.APP_HOST}:${env.APP_PORT}`)
    })

    app.use('/role', roleRouter)

    app.use('/auth', authRouter)

    app.use('/course', courseRouter)
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
