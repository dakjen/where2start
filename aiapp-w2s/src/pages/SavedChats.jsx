
import React, { useState, useEffect } from 'react';
import { Message, SavedConversation } from '@/api/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function SavedChats() {
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
    loadSavedConversations();
  }, []);

  const loadSavedConversations = async () => {
    setIsLoading(true);
    const savedConvs = await SavedConversation.list('-created_date');
    
    const conversationList = await Promise.all(
      savedConvs.map(async (saved) => {
        const messages = await Message.filter(
          { conversation_id: saved.conversation_id },
          'created_date',
          100
        );
        
        return {
          id: saved.conversation_id,
          savedId: saved.id,
          title: saved.title,
          messages: messages,
          lastMessageDate: messages[messages.length - 1]?.created_date || saved.created_date,
          messageCount: messages.length
        };
      })
    );

    setConversations(conversationList);
    setIsLoading(false);
  };

  const unsaveConversation = async (savedId, e) => {
    e.stopPropagation();
    await SavedConversation.delete(savedId);
    loadSavedConversations();
  };

  const openConversation = (conversationId) => {
    navigate(createPageUrl('Chat') + `?conversation_id=${conversationId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#1a1a1a] dark:to-[#000000] p-4">
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Chat')}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#c6c6c6]/30 dark:hover:bg-[#333333]">
              <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Saved Chats</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Your bookmarked conversations</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-[#1f1f1f] border-gray-200 dark:border-gray-700">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No saved chats yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Bookmark conversations to see them here</p>
            <Link to={createPageUrl('Chat')}>
              <Button className="bg-[#510069] hover:bg-[#510069]/90 text-white dark:bg-[#7a009c] dark:hover:bg-[#9c00c4]">
                Start Chatting
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
                  className="p-5 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#510069]/30 dark:hover:border-[#7a009c]/50 bg-white dark:bg-[#1f1f1f] dark:border-gray-800"
                  onClick={() => openConversation(conv.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Bookmark className="w-4 h-4 text-[#9ab292] dark:text-[#c4e0bc] flex-shrink-0" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(conv.lastMessageDate), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                        {conv.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {conv.messageCount} {conv.messageCount === 1 ? 'message' : 'messages'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 flex-shrink-0"
                      onClick={(e) => unsaveConversation(conv.savedId, e)}
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
