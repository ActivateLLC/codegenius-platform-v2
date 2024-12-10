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
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: `Analyze this code and provide 3 specific, actionable suggestions for improvement. Focus on performance, readability, and best practices. Format as a brief list.

Code:
${code}`
      }]
    });

    const suggestions = response.content
      .toString()
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({ error: 'Error processing AI request' });
  }
};