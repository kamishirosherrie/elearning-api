import { env } from '~/config/environment'
import { toeicSpeakingPrompt, toeicWritingPrompt } from './promptToeic'
import axios from 'axios'
import { chatbotPrompt } from './promptChatbot'

export const evaluateWriting = async (questions) => {
    const prompt = toeicWritingPrompt(questions)

    const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            model: 'anthropic/claude-3-haiku',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                'HTTP-Referer': 'http://localhost',
                'Content-Type': 'application/json',
            },
        },
    )

    const content = JSON.parse(response.data?.choices[0].message.content)
    try {
        const results = content.results.map((result, index) => ({
            score: result.score,
            feedback: result.feedback || 'No feedback provided.',
        }))

        const totalScore = parseFloat(content.scaledScore)
        return {
            results,
            totalScore,
        }
    } catch (err) {
        console.error('Error parsing AI result:', err)
        throw new Error('Failed to parse AI response')
    }
}

export const getClaudeSpeakingReply = async ({ topicContext, conversationHistory, userAnswer }) => {
    try {
        const messages = [
            { role: 'system', content: `${toeicSpeakingPrompt}\n\nChủ đề hôm nay: ${topicContext}` },
            ...conversationHistory.map((message) => ({
                role: message.from === 'ai' ? 'assistant' : 'user',
                content: message.text,
            })),
            { role: 'user', content: userAnswer },
        ]

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'anthropic/claude-3-haiku',
                messages,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                },
            },
        )

        return response.data.choices?.[0]?.message?.content || 'Sorry, I did not understand that.'
    } catch (error) {
        console.error('Claude speaking error:', error.message)
        return 'There was a problem generating a reply. Please try again.'
    }
}

export const getAIAssistantReply = async ({ courseInfo, conversationHistory, userMessage }) => {
    try {
        const messages = [
            { role: 'system', content: chatbotPrompt(courseInfo) },
            ...conversationHistory.map((message) => ({
                role: message.from === 'ai' ? 'assistant' : 'user',
                content: message.text,
            })),
            { role: 'user', content: userMessage },
        ]

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'anthropic/claude-3-haiku',
                messages,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                },
            },
        )
        return response.data.choices?.[0]?.message?.content || 'Sorry, I did not understand that.'
    } catch (error) {
        console.error('Claude speaking error:', error.message)
        return 'There was a problem generating a reply. Please try again.'
    }
}
