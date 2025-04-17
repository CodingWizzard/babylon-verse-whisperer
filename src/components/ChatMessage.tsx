
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type ChatMessageProps = {
  content: string;
  isUser: boolean;
  timestamp?: Date;
};

// Function to convert markdown code blocks to HTML
const formatMessageContent = (content: string) => {
  // Check if the content contains code blocks
  if (content.includes('```')) {
    return content.split(/```(?:javascript|js|typescript|ts|)?([\s\S]*?)```/).map((part, index) => {
      // Odd indices contain code
      if (index % 2 === 1) {
        return (
          <div key={index} className="code-block my-2 w-full overflow-x-auto">
            <pre className="whitespace-pre-wrap break-words">{part.trim()}</pre>
          </div>
        );
      }
      // Process regular text with line breaks
      return <p key={index} className="break-words overflow-wrap-anywhere" dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>') }} />;
    });
  }

  // For messages without code blocks, just handle line breaks
  return <p className="break-words overflow-wrap-anywhere" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, timestamp }) => {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      isUser ? "bg-muted ml-8" : "bg-card mr-8",
      "animate-fade-in"
    )}>
      <Avatar className={cn(
        "h-8 w-8",
        isUser ? "bg-primary" : "bg-babylon"
      )}>
        <span>{isUser ? 'U' : 'B'}</span>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium mb-1">
          {isUser ? 'You' : 'BabylonGPT'}
          {timestamp && (
            <span className="text-xs text-muted-foreground ml-2">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <div className="text-sm text-foreground break-words overflow-wrap-anywhere">
          {formatMessageContent(content)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
