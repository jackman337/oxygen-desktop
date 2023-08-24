import React from "react";
import { Box, Button, Heading, Spacer, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { deleteMessages } from "../../../redux/chatSlice";
import { Chat } from "../../../types";

type ChatTabProps = {
  chat: Chat | null,
};

const ChatConfigurationTab: React.FC<ChatTabProps> = ({ chat }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleClearHistory = () => {
    if (chat == null) return;

    dispatch(deleteMessages(chat.id));
  }

  return (
    <Box>
      <Spacer height="20px"/>
      <Box marginBottom={2}>
        <Text fontSize="14px">History</Text>
      </Box>
      <Button variant='outlinedPink' onClick={handleClearHistory} width="100%">Clear</Button>
      <Spacer height="20px"/>
    </Box>
  )
}

export default ChatConfigurationTab
