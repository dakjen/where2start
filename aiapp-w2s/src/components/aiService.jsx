import { InvokeLLM } from '@/api/integrations';

/**
 * Central AI service for generating responses
 * 
 * To integrate Google AI later:
 * 1. Add your Google AI API key configuration here
 * 2. Update this function to call Google AI API instead of InvokeLLM
 * 3. The rest of the app will automatically use the new integration
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
  
  if (conversationHistory && conversationHistory.length > 0) {
    fullPrompt += '\n\nConversation:\n' + conversationHistory
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
  }
  
  fullPrompt += '\n\nAssistant:';
  
  // Currently using the default InvokeLLM integration
  // TODO: Replace with Google AI when API key is available
  const response = await InvokeLLM({
    prompt: fullPrompt
  });
  
  return response;
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