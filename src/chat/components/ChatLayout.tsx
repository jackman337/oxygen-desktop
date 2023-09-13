// ChatLayout.tsx

import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, useToast } from "@chakra-ui/react";
import { ChatBox } from "./ChatBox";
import { ChatInput } from "./ChatInput";
import ProjectOxygenHeader from "../../header/components/ProjectOxygenHeader";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Chat, Message } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { getChatMessages } from "../../redux/chatSlice";
import { AppDispatch, RootState } from "../../store";
import {
  getDefaultPrompt,
  getLanguageModelApiKey,
  getLanguageModelName,
  getLanguageModelProvider
} from "../../storage/LocalStorage";

type ChatLayoutProps = {
  chat: Chat | null,
};

type CodeFile = {
  filename: string,
  content: string,
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ chat }) => {
  // Get messages from Redux
  const chatMessages = useSelector((state: RootState) => state.chat.messages);
  // Keep track of messages in a ref so we can update them without re-rendering
  const messagesRef = useRef<Message[]>([]);
  // The messages state is used to re-render the chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (chat != null) {
      dispatch(getChatMessages(chat.id));
    }
  }, [chat, dispatch]);

  useEffect(() => {
    setMessages(chatMessages);
    messagesRef.current = [...chatMessages];
  }, [chatMessages]);

  const getCodeFiles = (filenames: string[]): Promise<CodeFile>[] => {
    return filenames.map(filename => {
      // Load File from file storage using filename
      return window.electron.readFile(filename)
        .then((fileContents) => {
          console.log(`fileContents: ${fileContents}`);
          return { filename: filename, content: fileContents };
        })
    });
  }

  const onNewUserMessage = (message: Message, filenames: string[]) => {
    // Set isLoading to true when sending a message
    setIsLoading(true);

    // Set initial AI response placeholder
    const initialMessage = { sender: 'ASSISTANT', content: '' }
    messagesRef.current.push(message)
    messagesRef.current.push(initialMessage)

    if (messages.length === 0) {
      setMessages(prevMessages => [...prevMessages, message]);
    }

    // Get the content of the filenames from the database
    Promise.all(getCodeFiles(filenames))
      .then(codeFiles => {
        // Send the fileContents along with the message to the backend
        sendMessage(message.content, codeFiles)
      })
      .catch(err => {
        // If any promise was rejected, this block will be executed.
        console.error("Error reading files:", err);
      });
  };

  const sendMessage = async (message: string, codeFiles: CodeFile[]) => {
    // TODO (virat) - ensure access token is not expired
    const accessToken = localStorage.getItem('access');

    // Send message via WebSocket
    await fetchEventSource(`${process.env.REACT_APP_BACKEND_API_URL}/run_agent/`, {
      method: "POST",
      body: JSON.stringify({
        message: message,
        file_contents: codeFiles.map(codeFile => ({
          'file_name': codeFile.filename,
          'file_content': codeFile.content
        })),
        should_stream_output: true,
        llm_api_key: getLanguageModelApiKey(),
        llm_provider: getLanguageModelProvider(),
        llm_model_name: getLanguageModelName(),
        prompt: getDefaultPrompt(),
      }),
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${accessToken}`,
      },
      openWhenHidden: true,
      async onopen(res) {
        // onopen is used to inspect the response object and can be used to check for client errors
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          // Extract the error
          const clonedResponse = res.clone();
          const errorJson = JSON.parse(await clonedResponse.text());
          toast({
            title: "Error",
            description: errorJson.error,
            status: "error",
            duration: 10000,
            isClosable: true,
          });
          setIsLoading(false);
        }
      },
      onmessage(event) {
        let assistantMessage = event.data;

        // Copy the array to a new variable, so we don't mutate the state directly
        let newMessages = [...messagesRef.current];

        // Check if there are any messages in the array
        if (newMessages.length > 0) {
          // Get the last message in the array
          let lastMessage = newMessages[newMessages.length - 1];

          // Only append to the last message if it's from the AI
          if (lastMessage.sender === 'ASSISTANT') {
            // Append the incoming message to the content of the last message
            lastMessage.content += assistantMessage;

            // Replace the last message in the array with the updated last message
            newMessages[newMessages.length - 1] = lastMessage;
          } else {
            // If the last message is not from the AI, add a new message
            newMessages.push({ sender: 'ASSISTANT', content: assistantMessage });
          }
        } else {
          // If there are no previous messages, add a new message
          newMessages.push({ sender: 'ASSISTANT', content: assistantMessage });
        }

        // Update both the ref and the state
        messagesRef.current = newMessages;
        setMessages(newMessages);
      },
      onclose() {
        // onclose indicates that websocket connection has closed
        setIsLoading(false);
      },
      onerror(err) {
        // onerror handler would handle lower-level errors in the connection or processing of the event stream
        setIsLoading(false);
        throw err;
      },
    });
  }

  // Get the window width and subtract 500px for the sidebars
  const windowWidth = `${window.innerWidth - 500}px`;
  return (
    <Flex flex="1" direction="column" h="100%" maxW={windowWidth}>
      <ProjectOxygenHeader/>
      <Box flexGrow={1} overflowY="auto">
        <ChatBox messages={messages} isLoading={isLoading}/>
      </Box>
      <ChatInput onNewUserMessage={onNewUserMessage}/>
    </Flex>
  )
}

export default ChatLayout;
