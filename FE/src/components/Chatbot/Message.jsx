
import React from 'react';
import { cn } from '../../lib/utils'; // Import cn
import { Markdown } from '../Chatbot/Markdown';
// Icon giả định cho AI Mentor
const SparklesIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>...</svg>);

export const Message = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Bạn sẽ cần định nghĩa cấu trúc message: { role: 'user' | 'assistant', content: string }
  if (!message || !message.content) return null; 

  return (
    <div
      className={cn("w-full mx-auto max-w-4xl px-4", isUser ? 'text-right' : 'text-left')}
      data-role={message.role}
    >
      <div
        className={cn(
          
          'inline-block max-w-[75%] px-4 py-2 rounded-xl text-white', 
          'wrap-break-word',
          isUser
            ? 'ml-auto bg-blue-600 px-4' // User bubble
            : 'mr-auto bg-gray-800 px-4' // Assistant bubble
        )}
      >
        {!isUser && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-blue-500 float-left mr-3">
            <SparklesIcon className="size-4 text-blue-400" />
          </div>
        )}

        <div className="flex flex-col w-full">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  );
};