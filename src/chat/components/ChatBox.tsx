// ChatBox.tsx

import React from 'react';
import { Box } from "@chakra-ui/react";
import TypingIndicator from "./TypingIndicator";
import { ChatMessage } from "./ChatMessage";

type Message = {
  sender: string;
  content: string;
};

type ChatBoxProps = {
  messages: Message[];
  isLoading: boolean;
};

export const ChatBox: React.FC<ChatBoxProps> = ({messages, isLoading}) => {
  return (
    <Box flexGrow={1} overflowY="auto">
      {messages.map((message, index) => (
        <ChatMessage key={index} sender={message.sender} content={message.content} isUser={message.sender.toLowerCase() === 'user'}/>
      ))}
      <TypingIndicator isTyping={isLoading}/>
    </Box>
  );
};
