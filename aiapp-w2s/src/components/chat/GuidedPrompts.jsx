
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const questions = [
  'What is the name of your business?',
  'What industry is it in?',
  'Where is your target market?',
  'How many sales do you make a year?',
  'Are you service-based or product-based?',
  'What is your largest goal for this coming year?',
];

export default function GuidedPrompts({ onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState('');

  const handleNextQuestion = () => {
    if (inputValue.trim() === '') return;

    const newAnswers = { ...answers, [questions[currentQuestionIndex]]: inputValue };
    setAnswers(newAnswers);
    setInputValue('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4"
    >
      <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {questions[currentQuestionIndex]}
      </p>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleNextQuestion()}
          placeholder="Type your answer..."
          className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <Button onClick={handleNextQuestion} className="bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200">
          Next
        </Button>
      </div>
    </motion.div>
  );
}
