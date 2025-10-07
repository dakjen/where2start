
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAiResponse({ prompt, conversationHistory }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const chat = model.startChat({
    history: conversationHistory,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

module.exports = { getAiResponse };
