
import React, { useState, useEffect } from 'react';
import { Message } from '@/api/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function ChatHistory() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize dark mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    const allMessages = await Message.list('-created_date');
    
    // Group messages by conversation_id
    const conversationMap = {};
    allMessages.forEach(msg => {
      if (!conversationMap[msg.conversation_id]) {
        conversationMap[msg.conversation_id] = {
          id: msg.conversation_id,
          messages: [],
          lastMessageDate: msg.created_date
        };
      }
      conversationMap[msg.conversation_id].messages.push(msg);
    });

    // Convert to array and sort by most recent
    const conversationList = Object.values(conversationMap)
      .map(conv => ({
        ...conv,
        firstUserMessage: conv.messages.find(m => m.role === 'user')?.content || 'New conversation',
        messageCount: conv.messages.length
      }))
      .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

    setConversations(conversationList);
    setIsLoading(false);
  };

  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    const messagesToDelete = conversations.find(c => c.id === conversationId).messages;
    
    for (const msg of messagesToDelete) {
      await Message.delete(msg.id);
    }
    
    loadConversations();
  };

  const openConversation = (conversationId) => {
    navigate(createPageUrl('Chat') + `?conversation_id=${conversationId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#1a1a1a]/20 dark:to-black p-4">
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Chat')}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#c6c6c6]/30 dark:hover:bg-[#333]/30">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Chat History</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">All your conversations</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-gray-800">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No conversations yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Start chatting to see your history here</p>
            <Link to={createPageUrl('Chat')}>
              <Button className="bg-[#510069] hover:bg-[#510069]/90 dark:bg-purple-700 dark:hover:bg-purple-600">
                Start New Chat
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="p-5 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#510069]/30 dark:bg-gray-800 dark:hover:border-purple-700/30"
                  onClick={() => openConversation(conv.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-[#9ab292] dark:text-green-400 flex-shrink-0" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(conv.lastMessageDate), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                        {conv.firstUserMessage}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {conv.messageCount} {conv.messageCount === 1 ? 'message' : 'messages'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                      onClick={(e) => deleteConversation(conv.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
