import { env } from '~/config/environment'
import { toeicSpeakingPrompt, toeicWritingPrompt } from './promptToeic'
import axios from 'axios'

export const evaluateWriting = async (question, writingText) => {
    const prompt = toeicWritingPrompt(question, writingText)

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
            { role: 'system', content: toeicSpeakingPrompt },
            { role: 'user', content: topicContext },
            ...conversationHistory.map((msg) => ({
                role: msg.from === 'ai' ? 'assistant' : 'user',
                content: msg.text,
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
