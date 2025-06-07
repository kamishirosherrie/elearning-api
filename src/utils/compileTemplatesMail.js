import mjml2html from 'mjml'
import fs from 'fs'
import path from 'path'

const templateFiles = {
    emailReminder: 'emailReminder.mjml',
    newsletter: 'newsletter.mjml',
    unsubscribe: 'unsubscribe.mjml',
}

const mjmlTemplates = {}
for (const [key, fileName] of Object.entries(templateFiles)) {
    const filePath = path.join(__dirname, '..', 'services', 'templates', fileName)
    mjmlTemplates[key] = fs.readFileSync(filePath, 'utf-8')
}

export const filledTemplateReminder = (userName, link) => {
    const filled = mjmlTemplates.emailReminder.replace('{{userName}}', userName).replace('{{link}}', link)
    return mjml2html(filled).html
}

export const filledTemplateSubscribe = (userName) => {
    const filled = mjmlTemplates.newsletter.replace('{{userName}}', userName)
    return mjml2html(filled).html
}

export const filledTemplateUnsubscribe = (userName) => {
    const filled = mjmlTemplates.unsubscribe.replace('{{userName}}', userName)
    return mjml2html(filled).html
}
