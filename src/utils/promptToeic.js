export const toeicWritingPrompt = (answers) => {
    let formattedInput = ''
    answers.forEach((answer) => {
        formattedInput += `
        Question: ${answer.question}
        Answer: ${answer.text}
      `
    })

    return `
You are an English proficiency evaluator for the TOEIC test. Please grade the following writing submissions according to TOEIC Writing standards. The scoring will range from 0 to 10 points.

Instructions:
- Evaluate each answer based on grammar, vocabulary, relevance, clarity, and completeness.
- Provide a score for each answer from 0 to 10.
- Give brief feedback for each answer.

Input:
${formattedInput}

Return your response in JSON format as shown below:

{
  "results": [
    { 
        "question": "Write a sentence using the word 'library'", 
        "score": 7, 
        "feedback": "Good sentence, but could use a stronger vocabulary."
    },
    { 
        "question": "Describe the picture", 
        "score": 8, 
        "feedback": "Clear description."
    },
    ...
  ],
  "scaledScore": ...
}
`
}
