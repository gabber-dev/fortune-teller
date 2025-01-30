import React from 'react';
import { ChatHeader } from '../Components/ChatHeader';
import { MessageList } from '../Components/MessageList';
import { ChatInput } from '../Components/ChatInput';
import { useChat } from '../../hooks/useChat';

interface Persona {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  voice: string;
}

export const ChatContainer = () => {
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <MessageList messages={messages} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};