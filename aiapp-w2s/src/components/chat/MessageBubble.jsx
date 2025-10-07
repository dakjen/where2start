
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

export default function MessageBubble({ message, isLatest }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
        isUser ? 'bg-[#510069] dark:bg-white' : 'bg-[#9ab292] dark:bg-white'
      }`}>
        {isUser ? <User className="w-5 h-5 text-white dark:text-[#510069]" /> : <Bot className="w-5 h-5 text-white dark:text-[#510069]" />}
      </div>
      
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl shadow-md ${
          isUser 
            ? 'bg-[#510069] dark:bg-white text-white dark:text-[#510069] rounded-tr-sm' 
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-sm border border-gray-200 dark:border-gray-700'
        }`}>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
