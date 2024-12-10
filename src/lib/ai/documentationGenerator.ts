import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

export interface DocumentationConfig {
  includeExamples: boolean;
  format: 'markdown' | 'jsdoc' | 'tsdoc';
  detailLevel: 'brief' | 'detailed';
}

export async function generateDocumentation(
  code: string,
  config: DocumentationConfig
): Promise<string> {
  const prompt = `Generate ${config.format} documentation for this code.
${config.includeExamples ? 'Include usage examples.' : ''}
Provide ${config.detailLevel} explanations.

Code to document:
${code}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1500,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Documentation generation error:', error);
    throw new Error('Failed to generate documentation');
  }
}