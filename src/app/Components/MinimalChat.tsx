"use client";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Mic, Keyboard } from 'lucide-react';
import { useRealtimeSessionEngine } from 'gabber-client-react';

interface Message {
  id: string;
  content: string;
  isAgent: boolean;
  timestamp: Date;
}

export const MinimalChat = forwardRef((props, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const { sendChatMessage, setMicrophoneEnabled, microphoneEnabled, startAudio } = useRealtimeSessionEngine();

  const toggleMicrophone = async () => {
    try {
      if (!microphoneEnabled) {
        await startAudio();
      }
      setMicrophoneEnabled(!microphoneEnabled);
    } catch (error) {
      console.error('Error toggling microphone:', error);
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      await sendChatMessage({ text });
      const newMessage = {
        id: Date.now().toString(),
        content: text,
        isAgent: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== newMessage.id));
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSendMessage
  }));

  return (
    <div className="relative">
      {/* Floating message display */}
      <div className="absolute bottom-20 right-0 w-64 space-y-2">
        {messages.map(message => (
          <div
            key={message.id}
            className="text-purple-200 font-mystical text-lg tracking-wide animate-fade-out"
          >
            {message.content}
          </div>
        ))}
      </div>

      {/* Input controls */}
      <div className="flex gap-2">
        <button
          onClick={toggleMicrophone}
          className={`p-3 rounded-full transition-colors ${
            microphoneEnabled 
              ? 'bg-purple-800/50 text-red-300' 
              : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsTyping(!isTyping)}
          className="p-3 rounded-full bg-purple-800/50 text-purple-200 hover:bg-purple-700/50"
        >
          <Keyboard className="w-5 h-5" />
        </button>

        {isTyping && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (inputText.trim()) {
                handleSendMessage(inputText);
                setInputText('');
              }
            }}
            className="flex-1"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-2 rounded-full bg-purple-800/50 text-purple-200 placeholder-purple-400 focus:outline-none font-mystical"
              placeholder="Speak your question..."
            />
          </form>
        )}
      </div>
    </div>
  );
}); 