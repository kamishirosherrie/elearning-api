import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.NODE_MAILER_USER,
        pass: env.NODE_MAILER_PASS,
    },
})

export const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: env.NODE_MAILER_USER,
            to,
            subject,
            text,
        }

        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
    } catch (error) {
        console.log('Email sent failed', error)
    }
}
