import { getMessagesByConversation, getSavedConversations, deleteSavedConversation, getCurrentUser } from './client';

export class Message {
  static async filter(params, orderBy, limit) {
    // This is a placeholder. You'll need to implement actual filtering logic.
    // For now, it will just return messages for a conversation if conversation_id is provided.
    if (params.conversation_id) {
      return getMessagesByConversation(params.conversation_id);
    }
    return [];
  }
}

export class SavedConversation {
  static async list(orderBy) {
    // This is a placeholder. You'll need to implement actual listing logic.
    return getSavedConversations();
  }

  static async delete(id) {
    // This is a placeholder. You'll need to implement actual deletion logic.
    return deleteSavedConversation(id);
  }
}

export class User {
  static async me() {
    return getCurrentUser();
  }
}