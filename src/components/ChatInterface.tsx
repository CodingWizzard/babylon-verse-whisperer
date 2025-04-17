
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
};

const DEFAULT_API_KEY = '';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm BabylonGPT, your Babylon.js documentation assistant. Ask me anything about Babylon.js and I'll help you find the information you need.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [showApiInput, setShowApiInput] = useState(DEFAULT_API_KEY === '');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    if (!apiKey && showApiInput) {
      toast({
        title: "API Key Required",
        description: "Please enter your Groq API key to continue.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const systemPrompt = `
        You are BabylonGPT, an AI assistant specialized in Babylon.js, a powerful 3D engine for web applications.
        Your knowledge covers the entire Babylon.js documentation, APIs, features, and best practices.
        When providing code examples, use JavaScript or TypeScript and format them with markdown code blocks.
        Focus exclusively on Babylon.js and related topics like WebGL, 3D rendering, and game development.
        Be precise, detailed, and provide working code examples whenever possible.
      `;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage.content
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        content: data.choices[0].message.content,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error fetching response:', error);

      const errorMessage: Message = {
        content: "Sorry, I encountered an error while processing your request. Please check your API key or try again later.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to get a response. Please check your API key or try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        // Force a small delay to ensure the DOM has updated
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 50);
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] overflow-hidden">
      {showApiInput && (
        <div className="bg-card p-4 mb-4 rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-2">Groq API Key Required</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Please enter your Groq API key to use BabylonGPT.
            You can get a key from <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">Groq's website</a>.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Groq API key"
              className="flex-1"
            />
            <Button
              onClick={() => setShowApiInput(false)}
              disabled={!apiKey}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      <ScrollArea
        className="flex-1 overflow-y-auto chat-scroll-container"
        ref={scrollAreaRef}
        style={{ height: 'calc(100vh - 12rem)' }}
      >
        <div className="flex flex-col gap-4 pb-4 px-4 w-full max-w-full">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Babylon.js..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            Powered by Groq AI
          </p>
          {!showApiInput && (
            <button
              onClick={() => setShowApiInput(true)}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Change API Key
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
