import { chatHistoryModel } from '~/models/chatHistoryModel'
import { courseModel } from '~/models/courseModel'
import { getAIAssistantReply, getClaudeSpeakingReply } from '~/utils/openai'

export const handleSpeakingConversation = async (req, res) => {
    try {
        const { topicContext, conversationHistory, userAnswer } = req.body

        if (!topicContext || !userAnswer) {
            return res.status(400).json({ message: 'Missing topicContext or userAnswer' })
        }

        const reply = await getClaudeSpeakingReply({ topicContext, conversationHistory, userAnswer })

        return res.status(200).json({ reply })
    } catch (error) {
        console.error('Speaking conversation error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const talkWithAI = async (req, res) => {
    try {
        const { userId } = req.user
        const { userMessage, conversationHistory } = req.body
        if (!userMessage) {
            return res.status(400).json({ message: 'Missing userMessage' })
        }
        const courseInfo = await courseModel.find()
        const reply = await getAIAssistantReply({ courseInfo, conversationHistory, userMessage })

        const chatHistory = [...conversationHistory, { from: 'ai', text: reply }]

        await chatHistoryModel.updateOne({ userId }, { $set: { message: chatHistory } }, { upsert: true })
        return res.status(200).json({ reply })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const loadChatHistory = async (req, res) => {
    try {
        const { userId } = req.user
        const chatHistory = await chatHistoryModel.findOne({ userId })
        return res.status(200).json({ chatHistory })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
