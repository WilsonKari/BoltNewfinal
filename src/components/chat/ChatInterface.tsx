import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { ChatMessage } from './ChatMessage';
import { useStore } from '../../lib/store';
import { sendChatMessage } from '../../lib/api';

export const ChatInterface: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, clearMessages, apiConfig } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input.trim(),
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(input.trim(), apiConfig, i18n.language);
       
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: Date.now(),
      };
       
      addMessage(aiMessage);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: t('error.apiError'),
        timestamp: Date.now(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
        <h2 className="text-xl font-semibold">{t('common.chat')}</h2>
        <Button variant="secondary" size="sm" onClick={clearMessages}>
          {t('common.clear')}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t dark:border-gray-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.inputPlaceholder')}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!input.trim() || isLoading} isLoading={isLoading}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};