
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 mb-4"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#9ab292] dark:bg-white shadow-lg">
        <Bot className="w-5 h-5 text-white dark:text-[#510069]" />
      </div>
      
      <div className="bg-white dark:bg-gray-800 px-5 py-4 rounded-2xl rounded-tl-sm shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#9ab292] dark:bg-white rounded-full"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
