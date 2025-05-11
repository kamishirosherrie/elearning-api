import mjml2html from 'mjml'
import fs from 'fs'
import path from 'path'

const mjmlTemplatePath = path.join(__dirname, '..', 'services', 'templates', 'emailReminder.mjml')
const mjmlTemplate = fs.readFileSync(mjmlTemplatePath, 'utf-8')

export const filledTemplateReminder = (userName, link) => {
    const filled = mjmlTemplate.replace('{{username}}', userName).replace('{{link}}', link)

    return mjml2html(filled).html
}
