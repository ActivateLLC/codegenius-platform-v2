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
    const { messages } = req.body;
    
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1500,
      temperature: 0.7,
      messages: messages.map(({ role, content }: any) => ({
        role: role === 'user' ? 'user' : 'assistant',
        content
      }))
    });

    res.status(200).json({ response: response.content });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Error processing AI request' });
  }
}