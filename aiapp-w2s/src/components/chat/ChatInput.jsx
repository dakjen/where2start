import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-0 bg-gradient-to-t from-[#c6c6c6]/30 via-[#c6c6c6]/20 to-transparent dark:from-[#510069]/50 dark:via-[#510069]/30 dark:to-transparent pt-4 pb-6 px-4">
      <div className="max-w-2xl mx-auto relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          className="pr-14 min-h-[54px] max-h-32 resize-none rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#510069] dark:focus:border-white shadow-lg text-[16px] bg-white dark:bg-gray-800 dark:text-white"
          rows={1}
        />
        <Button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-2 bottom-2 rounded-xl bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:hover:bg-gray-200 shadow-lg disabled:opacity-50"
          size="icon"
        >
          <Send className="w-5 h-5 dark:text-[#510069]" />
        </Button>
      </div>
    </form>
  );
}