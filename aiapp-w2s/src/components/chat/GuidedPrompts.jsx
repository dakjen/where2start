
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const questions = [
  'What is the name of your business?',
  'What industry is it in?',
  'Who is your target market?Is there a specific location you serve?',
  'How many sales do you make a year? or How much revenue do you make?',
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
      {Object.entries(answers).map(([question, answer], index) => (
        <div key={index} className="mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">{question}</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">{answer}</p>
        </div>
      ))}

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
