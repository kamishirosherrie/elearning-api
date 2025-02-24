import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.elng@gmail.com',
        pass: 'cial mgym tsdt wbxa',
    },
})

export const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: 'noreply.elng@gmail.com',
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
