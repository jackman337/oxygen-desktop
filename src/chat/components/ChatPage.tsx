import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import ChatLayout from "./ChatLayout";
import LeftSideBar from "../../sidebar/components/left/LeftSideBar";
import RightSideBar from "../../sidebar/components/right/RightSideBar";
import { BackgroundColor } from "../../styles/colors";
import { Chat } from "../../types";
import api from "../../auth/apiService";

type ChatPageProps = {};

const ChatPage: React.FC<ChatPageProps> = ({}) => {
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    getOrCreateChat();
  }, []);

  const getOrCreateChat = () => {
    api.post('/chats/get_or_create/', { chat_name: "My Chat" })
      .then((response) => {
        const chat = response.data
        setChat(chat);
      }).catch((error) => {
      console.error('Error getting or creating chat: ', error);
    });
  };

  return (
    <Box
      h="100vh"
      w="100%"
      display="flex"
      bg={BackgroundColor}>
      <LeftSideBar/>
      <ChatLayout chat={chat}/>
      <RightSideBar chat={chat}/>
    </Box>
  );
};

export default ChatPage;
