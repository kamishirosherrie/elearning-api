import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.NODE_MAILER_USER,
        pass: env.NODE_MAILER_PASS,
    },
})

export const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"EMaster" <${env.NODE_MAILER_USER}>`,
            to,
            subject,
            html,
        }

        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
    } catch (error) {
        console.log('Email sent failed', error)
    }
}

export const sendEmailReminder = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"EMaster" <${env.NODE_MAILER_USER}>`,
            to,
            subject,
            html,
        }

        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
    } catch (error) {
        console.log('Email sent failed', error)
    }
}
