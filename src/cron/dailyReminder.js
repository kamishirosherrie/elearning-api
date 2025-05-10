import cron from 'node-cron'
import { filledTemplateReminder, sendEmailReminder } from '../services/mailService.js'
import { userModel } from '~/models/userModel.js'

const sendMailToUsersSubcribed = async () => {
    const users = await userModel.find({ isSubcribedEmail: true }).lean()
    for (const user of users) {
        try {
            const mailContent = filledTemplateReminder(user.userName, 'https://emaster.vercel.app')
            await sendEmailReminder(user.email, 'Đã đến giờ học bài!', mailContent)
        } catch (error) {
            console.log(`Failed to send email to ${student.email}:`, error)
        }
    }
}

cron.schedule('0 21 * * *', async () => {
    console.log('Mail reminder was sent')
    await sendMailToUsersSubcribed()
})

// cron.schedule('* * * * *', async () => {
//     console.log('Mail reminder was sent')
//     await sendMailToUsersSubcribed()
// })
