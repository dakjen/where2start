/**
 * Central AI service for generating responses
 */
export async function getAiResponse({ prompt, systemPrompt, conversationHistory, businessContext }) {
  // Build the full prompt with system instructions and conversation history
  let fullPrompt = systemPrompt || 'You are a helpful AI assistant.';
  
  // Add business context if available
  if (businessContext) {
    fullPrompt += '\n\n=== USER BUSINESS CONTEXT ===\n';
    fullPrompt += `Business Name: ${businessContext.business_name}\n`;
    if (businessContext.industry) fullPrompt += `Industry: ${businessContext.industry}\n`;
    if (businessContext.description) fullPrompt += `Description: ${businessContext.description}\n`;
    fullPrompt += `Business Structure: ${businessContext.business_structure}\n`;
    if (businessContext.tax_election && businessContext.tax_election !== 'default') {
      fullPrompt += `Tax Election: ${businessContext.tax_election}\n`;
    }
    if (businessContext.location) fullPrompt += `Location: ${businessContext.location}\n`;
    if (businessContext.ownership_status) fullPrompt += `Ownership: ${businessContext.ownership_status}\n`;
    fullPrompt += '=== END BUSINESS CONTEXT ===\n';
  }
  
  const history = conversationHistory.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: fullPrompt + '\n\n' + prompt,
      conversationHistory: history,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}

/**
 * Configuration placeholder for future Google AI integration
 * 
 * Example usage when ready:
 * export const AI_CONFIG = {
 *   provider: 'google', // or 'default'
 *   apiKey: 'YOUR_GOOGLE_AI_API_KEY',
 *   model: 'gemini-pro'
 * };
 */