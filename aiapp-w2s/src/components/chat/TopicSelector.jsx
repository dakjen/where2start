
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const topics = [
  'a new goal',
  'business basics',
  'building my business',
  'scaling my business',
];

export default function TopicSelector({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4"
    >
      <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        What would you like to talk about?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <Button
            key={topic}
            variant="outline"
            onClick={() => onSelect(topic)}
            className="w-full h-auto p-4 text-left justify-start dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            {topic}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
