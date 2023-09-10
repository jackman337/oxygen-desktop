// PromptsTab.tsx

import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Divider, Flex, HStack, Spacer, Text, useToast, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Prompt } from "../../types";
import { getPrompts } from "../../redux/promptsSlice";
import { AddPromptModal } from "./AddPromptModal";
import api from "../../auth/apiService";
import { BackgroundColor, Green, White } from "../../styles/colors";
import { getDefaultPrompt, isDefaultPrompt, saveDefaultPrompt } from "../../storage/LocalStorage";

type PromptsTabProps = {};

const PromptsTab: React.FC<PromptsTabProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const prompts = useSelector((state: RootState) => state.prompts.prompts);
  const [showAddPromptModal, setShowAddPromptModal] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: '0px', y: '0px' });
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [defaultPrompt, setDefaultPrompt] = useState<Prompt | null>(getDefaultPrompt());

  useEffect(() => {
    dispatch(getPrompts());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  const handleRightClick = (event: React.MouseEvent, prompt: Prompt) => {
    event.preventDefault();
    setSelectedPrompt(prompt); // Set the selected prompt
    setShowContextMenu(true);
    setContextMenuPosition({ x: `${event.clientX}px`, y: `${event.clientY}px` });
  };

  const closeContextMenu = () => {
    setSelectedPrompt(null);
    setShowContextMenu(false);
  };

  const onDeletePromptClicked = (prompt: Prompt) => {
    api.delete(`/prompts/${prompt.id}/`)
      .then(() => {
        dispatch(getPrompts());
        toast({
          title: `${prompt.name} deleted`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }).catch(error => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    })
  }

  const onToggleDefaultPrompt = (prompt: Prompt) => {
    if (isDefaultPrompt(prompt)) {
      setDefaultPrompt(null);
      // Update in local storage
      saveDefaultPrompt(null);
      return;
    } else {
      setDefaultPrompt(prompt);
      // Update in local storage
      saveDefaultPrompt(prompt);
    }
  }

  const onPromptCreated = (prompt: Prompt) => {
    dispatch(getPrompts());
    toast({
      title: `${prompt.name} created!`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    if (isDefaultPrompt(prompt)) {
      setDefaultPrompt(prompt);
    }
  }

  const onAddPromptClicked = () => {
    setShowAddPromptModal(true)
  }

  const onCloseAddPromptModal = () => {
    setShowAddPromptModal(false)
  }

  return (
    <Box
      maxHeight="calc(100vh - 300px)"
      overflowY="auto"
    >
      <Spacer height="10px"/>
      <Button variant='outlinedWhite' onClick={onAddPromptClicked} width="100%">Add prompt</Button>
      <Spacer height="10px"/>
      {prompts.map(prompt => {
        return (
          <Box
            onContextMenu={(event) => handleRightClick(event, prompt)}
            key={prompt.id}
            cursor="pointer"
            _hover={{ backgroundColor: '#3f3f3f' }}
            paddingX="12px"
          >
            <Spacer height="10px"/>
            <Flex direction="column" justify="space-between">
              <HStack spacing="auto">
                <VStack spacing={1} align="start">
                  <Text fontSize='14px' fontWeight='bold' isTruncated
                        textColor={prompt.token === defaultPrompt?.token ? Green : White}>
                    {prompt.name}
                  </Text>
                  <Text fontSize='12px' color='#919191' isTruncated>
                    {prompt.content.slice(0, 30)}{prompt.content.length > 30 ? '...' : ''}
                  </Text>
                </VStack>
                <Spacer/>
              </HStack>
            </Flex>
            <Spacer height="10px"/>
          </Box>
        );
      })}
      {showContextMenu && (
        <Box
          ref={menuRef}
          position="fixed"
          left={contextMenuPosition.x}
          top={contextMenuPosition.y}
          zIndex="popover"
          borderWidth="1px"
          borderColor="#3f3f3f"
          minWidth="200px"
        >
          <Box
            _hover={{ bg: '#3f3f3f', color: 'white' }}
            padding="5px"
            cursor="pointer"
            bg={BackgroundColor}
            onClick={() => {
              // Toggle the selected prompt as default
              if (selectedPrompt) {
                onToggleDefaultPrompt(selectedPrompt);
              }
              closeContextMenu();
            }}
          >
            <Text marginLeft="12px" fontSize="14px">
              {isDefaultPrompt(selectedPrompt) ? 'Remove as default' : 'Set as default'}
            </Text>
          </Box>
          <Divider/>
          <Box
            _hover={{ bg: '#3f3f3f', color: 'white' }}
            bg={BackgroundColor}
            padding="5px"
            cursor="pointer"
            onClick={() => {
              // Delete the selected prompt
              if (selectedPrompt) {
                onDeletePromptClicked(selectedPrompt);
              }
              closeContextMenu();
            }}
          >
            <Text marginLeft="12px" fontSize="14px">
              Delete
            </Text>
          </Box>
        </Box>
      )}
      <Spacer height="20px"/>
      {showAddPromptModal && (
        <AddPromptModal isOpen={showAddPromptModal} onClose={onCloseAddPromptModal} onPromptCreated={onPromptCreated}/>
      )}
    </Box>
  )
}

export default PromptsTab
