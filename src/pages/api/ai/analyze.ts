import type { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: `Analyze this code and provide detailed feedback in the following format:

1. Calculate a complexity score (1-10)
2. List security vulnerabilities or concerns
3. List performance improvement suggestions
4. List general best practice recommendations

Code:
${code}

Provide the response in JSON format with the following structure:
{
  "complexity": number,
  "security": string[],
  "performance": string[],
  "suggestions": string[]
}`
      }]
    });

    // Parse the AI response and convert to proper JSON structure
    const analysisText = response.content.toString();
    const analysisJson = JSON.parse(
      analysisText.substring(
        analysisText.indexOf('{'),
        analysisText.lastIndexOf('}') + 1
      )
    );

    res.status(200).json(analysisJson);
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: 'Error processing AI request' });
  }
};