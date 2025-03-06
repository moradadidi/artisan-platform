import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Custom type for the code component to include the inline property.
interface CustomCodeProps {
  node: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    // Save the current input to use in the API call
    const messageToSend = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
          import.meta.env.VITE_GEMINI_API_KEY,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: messageToSend,
                  },
                ],
              },
            ],
          }),
        }
      );
      
      const data = await response.json();
      // Log the response for debugging
      console.log('API response:', data);

      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!botResponse) {
        throw new Error('Invalid response structure from API.');
      }

      setMessages(prev => [
        ...prev,
        { text: botResponse, isBot: true, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          text: "I apologize, but I couldn't process that request. Please try again.",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          bg-yellow-400 cursor-pointer hover:bg-yellow-500 rounded-full p-4 shadow-lg
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 hover:scale-110 animate-bounce'}
        `}
      >
        <MessageCircle className="w-6 h-6 text-yellow-900" />
      </button>

      {/* Chat Window */}
      <div className={`
         fixed bottom-0 right-0
          sm:right-6 sm:bottom-6
          w-[85vw] sm:w-[350px] max-w-[100vw]
          bg-white rounded-t-2xl sm:rounded-2xl
          shadow-2xl border border-yellow-200 overflow-hidden
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
        `}>
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <img src="./logo.png" alt="Logo" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-yellow-900">Artisan Assistant</h3>
              <p className="text-xs text-yellow-800">Always here to help</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-yellow-900 hover:text-yellow-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[60vh] sm:h-[500px] overflow-y-auto p-4 bg-gradient-to-b from-yellow-50/50 to-white">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <Bot className="w-12 h-12 text-yellow-600" />
              </div>
              <p className="text-center font-medium text-yellow-800">
                Hi! I'm your Artisan Assistant.
              </p>
              <p className="text-center text-sm text-yellow-600 mt-2">
                How can I help you today?
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-6 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${
                  message.isBot ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                    ${message.isBot ? 'bg-yellow-100' : 'bg-yellow-400'}
                  `}
                >
                  <img
                    src={message.isBot ? './logo.png' : user?.profilePicture || './default.png'}
                    alt={message.isBot ? 'Bot' : 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div
                    className={`p-4 rounded-2xl shadow-sm
                      ${
                        message.isBot
                          ? 'bg-white text-gray-800 rounded-tl-none border border-yellow-100'
                          : 'bg-yellow-400 text-yellow-900 rounded-tr-none'
                      }
                    `}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="m-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="m-0 pl-4" {...props} />,
                          ol: ({ node, ...props }) => <ol className="m-0 pl-4" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          code: ({ node, inline, ...props }: CustomCodeProps) =>
                            inline ? (
                              <code className="bg-yellow-50 px-1 py-0.5 rounded text-sm" {...props} />
                            ) : (
                              <code className="block bg-yellow-50 p-2 rounded-lg text-sm my-2 overflow-x-auto" {...props} />
                            ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <span
                    className={`text-xs ${message.isBot ? 'text-left' : 'text-right'} text-gray-500`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="bg-white border border-yellow-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-2">
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-yellow-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-yellow-50/50 border-2 border-yellow-200 rounded-xl focus:outline-none focus:border-yellow-400 transition-colors placeholder-yellow-600/50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`
                bg-yellow-400 text-yellow-900 rounded-xl p-3
                transition-all duration-200 min-w-[44px]
                ${isLoading || !input.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-yellow-500 hover:shadow-md active:scale-95'}
              `}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
