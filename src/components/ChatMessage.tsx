import React from 'react';

interface ChatMessageProps {
  sender: 'user' | 'bot';
  message: string;
}

export function ChatMessage({ sender, message }: ChatMessageProps) {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg ${
        sender === 'user' 
          ? 'bg-gray-800 text-white' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {message}
      </div>
    </div>
  );
}