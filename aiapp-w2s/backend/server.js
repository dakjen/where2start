
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Mock user data
let mockUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    onboarding_completed: true,
    business_type: 'has_business',
    full_name: 'Test User',
    created_date: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    onboarding_completed: true,
    business_type: null,
    full_name: 'Admin User',
    created_date: new Date().toISOString(),
  },
];

// Mock messages data
let mockMessages = [];
let nextMessageId = 1;

// Mock saved conversations data
let mockSavedConversations = [];
let nextSavedConversationId = 1;

// Mock chat settings data
let mockChatSettings = null;

// Mock API keys data
let apiKeys = [];
let nextApiKeyId = 1;

const { getAiResponse } = require('./aiService');

// Mock businesses data
let mockBusinesses = [];
let nextBusinessId = 1;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.removeHeader('Content-Security-Policy'); // Remove any existing CSP header
  res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' http://localhost:3001 ws://localhost:3001; style-src 'self' 'unsafe-inline'; img-src 'self' https://base44.com data:;");
  next();
});

const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Get current user
apiRouter.get('/users/me', (req, res) => {
  res.json(mockUsers[0]);
});

// Update user
apiRouter.patch('/users/me', (req, res) => {
  mockUsers[0] = { ...mockUsers[0], ...req.body };
  res.json(mockUsers[0]);
});

// Get all users
apiRouter.get('/users', (req, res) => {
  res.json(mockUsers);
});

// Update a user by id
apiRouter.patch('/users/:id', (req, res) => {
  const userId = req.params.id;
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...req.body };
    res.json(mockUsers[userIndex]);
  } else {
    res.status(404).send('User not found');
  }
});

// Create a new user
apiRouter.post('/users', (req, res) => {
  const newUser = {
    id: (mockUsers.length + 1).toString(), // Simple ID generation
    ...req.body,
    created_date: new Date().toISOString(),
    onboarding_completed: false, // New users start with onboarding not completed
    role: 'user', // Default role
  };
  mockUsers.push(newUser);
  res.status(201).json(newUser);
});

// Delete a user
apiRouter.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1);
    res.status(204).send(); // No content to send back
  } else {
    res.status(404).send('User not found');
  }
});

// Get all messages
apiRouter.get('/messages', (req, res) => {
  res.json(mockMessages);
});

// Filter messages
apiRouter.get('/messages/filter', (req, res) => {
  const { conversation_id } = req.query;
  if (conversation_id) {
    const filteredMessages = mockMessages.filter(m => m.conversation_id === conversation_id);
    res.json(filteredMessages);
  } else {
    res.json(mockMessages);
  }
});

// Create a new message
apiRouter.post('/messages', (req, res) => {
  const newMessage = {
    id: nextMessageId++,
    ...req.body,
    created_date: new Date().toISOString(),
  };
  mockMessages.push(newMessage);
  res.status(201).json(newMessage);
});

// Get all saved conversations
apiRouter.get('/saved-conversations', (req, res) => {
  res.json(mockSavedConversations);
});

// Filter saved conversations
apiRouter.get('/saved-conversations/filter', (req, res) => {
  const { conversation_id } = req.query;
  if (conversation_id) {
    const filteredSavedConversations = mockSavedConversations.filter(sc => sc.conversation_id === conversation_id);
    res.json(filteredSavedConversations);
  } else {
    res.json(mockSavedConversations);
  }
});

// Create a new saved conversation
apiRouter.post('/saved-conversations', (req, res) => {
  const newSavedConversation = {
    id: nextSavedConversationId++,
    ...req.body,
    created_date: new Date().toISOString(),
  };
  mockSavedConversations.push(newSavedConversation);
  res.status(201).json(newSavedConversation);
});

// Delete a saved conversation
apiRouter.delete('/saved-conversations/:id', (req, res) => {
  const savedConversationId = parseInt(req.params.id, 10);
  const savedConversationIndex = mockSavedConversations.findIndex(sc => sc.id === savedConversationId);
  if (savedConversationIndex !== -1) {
    mockSavedConversations.splice(savedConversationIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Saved conversation not found');
  }
});

// Get chat settings
apiRouter.get('/chat-settings', (req, res) => {
  res.json(mockChatSettings);
});

// Create chat settings
apiRouter.post('/chat-settings', (req, res) => {
  mockChatSettings = { ...req.body };
  res.status(201).json(mockChatSettings);
});

// Get all API keys
apiRouter.get('/keys', (req, res) => {
  res.json(apiKeys);
});

// Create a new API key
apiRouter.post('/keys', (req, res) => {
  const newKey = {
    id: nextApiKeyId++,
    ...req.body,
    created_date: new Date().toISOString(),
    is_active: true,
    usage_count: 0,
    last_used: null,
  };
  apiKeys.push(newKey);
  res.status(201).json(newKey);
});

// Update an API key
apiRouter.patch('/keys/:id', (req, res) => {
  const keyId = parseInt(req.params.id, 10);
  const keyIndex = apiKeys.findIndex(k => k.id === keyId);
  if (keyIndex !== -1) {
    apiKeys[keyIndex] = { ...apiKeys[keyIndex], ...req.body };
    res.json(apiKeys[keyIndex]);
  } else {
    res.status(404).send('API Key not found');
  }
});

// Delete an API key
apiRouter.delete('/keys/:id', (req, res) => {
  const keyId = parseInt(req.params.id, 10);
  const keyIndex = apiKeys.findIndex(k => k.id === keyId);
  if (keyIndex !== -1) {
    apiKeys.splice(keyIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send('API Key not found');
  }
});

// Get all businesses
apiRouter.get('/businesses', (req, res) => {
  res.json(mockBusinesses);
});

// Create a new business
apiRouter.post('/businesses', (req, res) => {
  const newBusiness = {
    id: nextBusinessId++,
    ...req.body,
    created_date: new Date().toISOString(),
  };
  mockBusinesses.push(newBusiness);
  res.status(201).json(newBusiness);
});

// Update a business
apiRouter.patch('/businesses/:id', (req, res) => {
  const businessId = parseInt(req.params.id, 10);
  const businessIndex = mockBusinesses.findIndex(b => b.id === businessId);
  if (businessIndex !== -1) {
    mockBusinesses[businessIndex] = { ...mockBusinesses[businessIndex], ...req.body };
    res.json(mockBusinesses[businessIndex]);
  } else {
    res.status(404).send('Business not found');
  }
});

// Delete a business
apiRouter.delete('/businesses/:id', (req, res) => {
  const businessId = parseInt(req.params.id, 10);
  const businessIndex = mockBusinesses.findIndex(b => b.id === businessId);
  if (businessIndex !== -1) {
    mockBusinesses.splice(businessIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Business not found');
  }
});

// AI chat endpoint
apiRouter.post('/ai/chat', async (req, res) => {
  try {
    const { prompt, conversationHistory } = req.body;
    const response = await getAiResponse({ prompt, conversationHistory });
    res.json({ response });
  } catch (error) {
    console.error('Error in AI chat endpoint:', error);
    res.status(500).send('Error communicating with AI');
  }
});

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
