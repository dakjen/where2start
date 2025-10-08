

import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser, getMessagesByConversation, createMessage, getChatSettings, createChatSettings, getSavedConversationByConversation, createSavedConversation, deleteSavedConversation, getBusinesses } from '@/api/client';
import { AnimatePresence } from 'framer-motion';
import { Menu, Sparkles, Plus, Bookmark, BookmarkCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import ChatInput from '../components/chat/ChatInput';
import Sidebar from '../components/Sidebar';
import GuidedPrompts from '../components/chat/GuidedPrompts';
import BusinessSelector from '../components/chat/BusinessSelector';
import TopicSelector from '../components/chat/TopicSelector';
import { getAiResponse } from '../components/aiService';

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('conversation_id') || `conv_${Date.now()}`;
  });
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showGuidedPrompts, setShowGuidedPrompts] = useState(false);
  const [conversationState, setConversationState] = useState('idle');
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (user && !isCheckingOnboarding) {
      loadMessages();
      loadSettings();
      checkIfSaved();
    }
  }, [user, isCheckingOnboarding, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const checkOnboarding = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser.onboarding_completed) {
        navigate(createPageUrl('Welcome'));
        return;
      }

      if (currentUser.business_type === 'has_business' && !window.location.search.includes('conversation_id')) {
        setShowGuidedPrompts(true);
      } else if (currentUser.onboarding_completed && !window.location.search.includes('conversation_id')) {
        const userBusinesses = await getBusinesses();
        setBusinesses(userBusinesses);
        setConversationState('selecting_business');
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    const msgs = await getMessagesByConversation(conversationId);
    setMessages(msgs);
  };

  const loadSettings = async () => {
    const allSettings = await getChatSettings();
    if (allSettings) {
      setSettings(allSettings);
    } else {
      const systemPrompt = `You are a helpful AI assistant specializing in business fundamentals. Your role is to explain basic business concepts, guide users through foundational steps, and provide clear, concise information on starting and running a business.`;
      const welcomeMessage = "Welcome to Business Basics! I'm here to help you understand the core principles of business. What would you like to learn about today?";

      const defaultSettings = await createChatSettings({
        system_prompt: systemPrompt,
        chat_title: 'Business Basics',
        welcome_message: welcomeMessage
      });
      setSettings(defaultSettings);
    }
  };

  const checkIfSaved = async () => {
    const saved = await getSavedConversationByConversation(conversationId);
    setIsSaved(saved.length > 0);
  };

  const toggleSaveConversation = async () => {
    if (isSaved) {
      const saved = await getSavedConversationByConversation(conversationId);
      if (saved.length > 0) {
        await deleteSavedConversation(saved[0].id);
        setIsSaved(false);
      }
    } else {
      const firstUserMsg = messages.find(m => m.role === 'user')?.content || 'New conversation';
      await createSavedConversation({
        conversation_id: conversationId,
        title: firstUserMsg.substring(0, 100)
      });
      setIsSaved(true);
    }
  };

  const startNewChat = () => {
    const newConvId = `conv_${Date.now()}`;
    setConversationId(newConvId);
    setMessages([]);
    setIsSaved(false);
    navigate(createPageUrl('Chat'));
  };

  const handleGuidedPromptsComplete = async (answers) => {
    console.log('handleGuidedPromptsComplete called with answers:', answers);
    setShowGuidedPrompts(false);
    const summary = Object.entries(answers).map(([question, answer]) => `${question}\n${answer}`).join('\n\n');
    const prompt = `these are the answers to these questions from this user. please provide your advise on how they can meet thier goals, and ask simple follow up questions to hone in your advice.\n\n${summary}`;
    console.log('Calling sendMessage with prompt:', prompt);
    await sendMessage(prompt);
  };

  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    setConversationState('selecting_topic');
  };

  const handleTopicSelect = async (topic) => {
    setConversationState('idle');
    const prompt = `please respond to any questions and concerns the user has.`;
    await sendMessage(prompt);
  };

  const sendMessage = async (content) => {
    console.log('sendMessage called with content:', content);
    const userMessage = await createMessage({
      content,
      role: 'user',
      conversation_id: conversationId
    });
    console.log('User message created:', userMessage);
    setMessages(prev => [...prev, userMessage]);

    setIsTyping(true);

    try {
      console.log('Calling getAiResponse...');
      const response = await getAiResponse({
        prompt: content,
        systemPrompt: settings?.system_prompt || 'You are a helpful AI assistant.',
        conversationHistory: [...messages, userMessage]
      });

      console.log('AI response received:', response);
      const aiMessage = await createMessage({
        content: response,
        role: 'assistant',
        conversation_id: conversationId
      });

      console.log('AI message created:', aiMessage);
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  if (isCheckingOnboarding) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#510069] dark:to-[#3a004d]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#510069] flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#510069] dark:to-[#3a004d]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="sticky top-0 z-10 bg-[#e3d2e8] dark:bg-[#510069] backdrop-blur-lg border-b border-[#c6c6c6] dark:border-white/20 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-full hover:bg-[#c6c6c6]/30 dark:hover:bg-white/20"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-white" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-[#9ab292] dark:bg-white flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white dark:text-[#510069]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Business Basics
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-300">Learn the fundamentals of starting and running a business</p>
            </div>
          </div>
          <div className="flex gap-2">
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-[#c6c6c6]/30 dark:hover:bg-white/20"
                onClick={toggleSaveConversation}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5 text-[#510069] dark:text-white" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-600 dark:text-white" />
                )}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-[#c6c6c6]/30 dark:hover:bg-white/20"
              onClick={startNewChat}
            >
              <Plus className="w-5 h-5 text-gray-600 dark:text-white" />
            </Button>
          </div>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-2xl mx-auto px-4 py-6">
          {messages.length === 0 && settings?.welcome_message && !showGuidedPrompts && conversationState === 'idle' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#9ab292] dark:bg-white flex items-center justify-center shadow-2xl">
                <Sparkles className="w-10 h-10 text-white dark:text-[#510069]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Where 2 Start?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {settings.welcome_message}
              </p>
            </div>
          )}

          {showGuidedPrompts && <GuidedPrompts onComplete={handleGuidedPromptsComplete} />}

          {conversationState === 'selecting_business' && <BusinessSelector businesses={businesses} onSelect={handleBusinessSelect} />}
          {conversationState === 'selecting_topic' && <TopicSelector onSelect={handleTopicSelect} />}

          <AnimatePresence>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSend={sendMessage} disabled={isTyping || showGuidedPrompts || conversationState !== 'idle'} onSaveChat={toggleSaveConversation} />
    </div>
  );
}
