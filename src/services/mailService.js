import nodemailer from 'nodemailer'
import { env } from '~/config/environment'
import mjml2html from 'mjml'
import fs from 'fs'
import path from 'path'

const mjmlTemplatePath = path.join(__dirname, 'templates', 'emailReminder.mjml')
const mjmlTemplate = fs.readFileSync(mjmlTemplatePath, 'utf-8')

export const filledTemplateReminder = (userName, link) => {
    const filled = mjmlTemplate.replace('{{username}}', userName).replace('{{link}}', link)

    return mjml2html(filled).html
}

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
            from: `"EMaster" <${env.NODE_MAILER_USER}>`,
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
