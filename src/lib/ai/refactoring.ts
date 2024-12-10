import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

export interface RefactoringOption {
  title: string;
  description: string;
  code: string;
  complexity: number;
  impact: 'high' | 'medium' | 'low';
}

export async function generateRefactoringOptions(code: string): Promise<RefactoringOption[]> {
  const prompt = `Analyze this code and suggest refactoring options. For each option, provide:
1. A title describing the refactoring
2. A detailed description of the changes and benefits
3. The refactored code
4. Complexity score (1-10)
5. Impact level (high/medium/low)

Format as JSON array:
[
  {
    "title": string,
    "description": string,
    "code": string,
    "complexity": number,
    "impact": "high" | "medium" | "low"
  }
]

Code to refactor:
${code}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    const optionsJson = JSON.parse(
      content.substring(
        content.indexOf('['),
        content.lastIndexOf(']') + 1
      )
    );

    return optionsJson;
  } catch (error) {
    console.error('Refactoring generation error:', error);
    throw new Error('Failed to generate refactoring options');
  }
}