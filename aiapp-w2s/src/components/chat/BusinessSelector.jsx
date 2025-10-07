
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function BusinessSelector({ businesses, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4"
    >
      <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Hello! Which business would you like to discuss today?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.map((business) => (
          <Button
            key={business.id}
            variant="outline"
            onClick={() => onSelect(business)}
            className="w-full h-auto p-4 text-left justify-start dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            <div>
              <p className="font-bold">{business.business_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{business.industry}</p>
            </div>
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
