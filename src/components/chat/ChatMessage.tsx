import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../../lib/types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
      }`}>
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      <div className={`flex-1 space-y-2 overflow-hidden px-1`}>
        <div className={`rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white ml-auto'
            : 'bg-gray-100 dark:bg-gray-800'
        } inline-block`}>
          {message.content}
        </div>
      </div>
    </div>
  );
};