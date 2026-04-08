import React from 'react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'model';
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] gap-3",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isUser ? "bg-stone-200 text-stone-600" : "bg-stone-800 text-stone-100"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
            isUser 
              ? "bg-stone-100 text-stone-900 rounded-tr-none" 
              : "bg-white border border-stone-100 text-stone-800 rounded-tl-none"
          )}
        >
          <div className="markdown-body prose prose-stone prose-sm max-w-none">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};
