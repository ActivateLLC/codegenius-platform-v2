import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

export interface CodeAnalysisResult {
  complexity: {
    score: number;
    details: string[];
  };
  security: {
    issues: string[];
    severity: ('high' | 'medium' | 'low')[];
  };
  performance: {
    suggestions: string[];
    impact: ('high' | 'medium' | 'low')[];
  };
  bestPractices: string[];
}

export async function analyzeCode(code: string): Promise<CodeAnalysisResult> {
  const prompt = `Analyze this code for complexity, security issues, performance, and best practices. Provide your analysis in JSON format with the following structure:

{
  "complexity": {
    "score": number (1-10),
    "details": string[]
  },
  "security": {
    "issues": string[],
    "severity": ("high" | "medium" | "low")[]
  },
  "performance": {
    "suggestions": string[],
    "impact": ("high" | "medium" | "low")[]
  },
  "bestPractices": string[]
}

Code to analyze:
${code}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    const analysisJson = JSON.parse(
      content.substring(
        content.indexOf('{'),
        content.lastIndexOf('}') + 1
      )
    );

    return analysisJson;
  } catch (error) {
    console.error('Code analysis error:', error);
    throw new Error('Failed to analyze code');
  }
}