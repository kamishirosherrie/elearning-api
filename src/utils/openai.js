import { env } from '~/config/environment'
import { toeicWritingPrompt } from './promptToeic'
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
