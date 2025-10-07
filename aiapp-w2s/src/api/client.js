
const API_URL = import.meta.env.VITE_API_URL;

async function fetchWrapper(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 204) return;
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const getCurrentUser = () => {
  return fetchWrapper(`${API_URL}/users/me`);
};

export const updateUser = (userData) => {
  return fetchWrapper(`${API_URL}/users/me`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });
};

export const getApiKeys = () => {
  return fetchWrapper(`${API_URL}/keys`);
};

export const createApiKey = (keyData) => {
  return fetchWrapper(`${API_URL}/keys`, {
    method: 'POST',
    body: JSON.stringify(keyData),
  });
};

export const updateApiKey = (keyId, keyData) => {
  return fetchWrapper(`${API_URL}/keys/${keyId}`, {
    method: 'PATCH',
    body: JSON.stringify(keyData),
  });
};

export const deleteApiKey = (keyId) => {
  return fetchWrapper(`${API_URL}/keys/${keyId}`, {
    method: 'DELETE',
  });
};

export const getUsers = () => {
  return fetchWrapper(`${API_URL}/users`);
};

export const updateUserById = (userId, userData) => {
  return fetchWrapper(`${API_URL}/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });
};

export const getMessages = () => {
  return fetchWrapper(`${API_URL}/messages`);
};

export const getSavedConversations = () => {
  return fetchWrapper(`${API_URL}/saved-conversations`);
};

export const getChatSettings = () => {
  return fetchWrapper(`${API_URL}/chat-settings`);
};

export const createChatSettings = (settingsData) => {
  return fetchWrapper(`${API_URL}/chat-settings`, {
    method: 'POST',
    body: JSON.stringify(settingsData),
  });
};

export const createMessage = (messageData) => {
  return fetchWrapper(`${API_URL}/messages`, {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
};

export const getMessagesByConversation = (conversationId) => {
  return fetchWrapper(`${API_URL}/messages/filter?conversation_id=${conversationId}`);
};

export const getSavedConversationByConversation = (conversationId) => {
  return fetchWrapper(`${API_URL}/saved-conversations/filter?conversation_id=${conversationId}`);
};

export const createSavedConversation = (savedConversationData) => {
  return fetchWrapper(`${API_URL}/saved-conversations`, {
    method: 'POST',
    body: JSON.stringify(savedConversationData),
  });
};

export const deleteSavedConversation = (savedConversationId) => {
  return fetchWrapper(`${API_URL}/saved-conversations/${savedConversationId}`, {
    method: 'DELETE',
  });
};

export const getBusinesses = () => {
  return fetchWrapper(`${API_URL}/businesses`);
};

export const createBusiness = (businessData) => {
  return fetchWrapper(`${API_URL}/businesses`, {
    method: 'POST',
    body: JSON.stringify(businessData),
  });
};

export const updateBusiness = (businessId, businessData) => {
  return fetchWrapper(`${API_URL}/businesses/${businessId}`, {
    method: 'PATCH',
    body: JSON.stringify(businessData),
  });
};

export const deleteBusiness = (businessId) => {
  return fetchWrapper(`${API_URL}/businesses/${businessId}`, {
    method: 'DELETE',
  });
};
