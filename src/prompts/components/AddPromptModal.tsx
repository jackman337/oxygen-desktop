import React, { ChangeEvent, FC, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea
} from "@chakra-ui/react";
import api from "../../auth/apiService";
import { Prompt } from "../../types";
import { saveDefaultPrompt } from "../../storage/LocalStorage";
import { Pink } from '../../styles/colors';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromptCreated: (prompt: Prompt) => void;
}

export const AddPromptModal: FC<AddPromptModalProps> = ({ isOpen, onClose, onPromptCreated }) => {
  const [promptName, setPromptName] = useState<string>('');
  const [promptContent, setPromptContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false)
  const [isDefaultPrompt, setIsDefaultPrompt] = useState<boolean>(true); // Default to true if you want it checked initially

  const onPromptNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPromptName(event.target.value);
  };

  const onPromptContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptContent(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDefaultPrompt(event.target.checked);
  };

  const createPrompt = async () => {
    if (!promptName) {
      setErrorMessage('Please enter a prompt name.');
      return;
    }

    if (!promptContent) {
      setErrorMessage("Please enter the prompt's content.");
      return;
    }
    // Clear the error message
    setErrorMessage('');

    setIsLoading(true)
    await api.post(`/prompts/`, {
      name: promptName,
      content: promptContent,
    }).then((response) => {
      setIsLoading(false);
      const prompt: Prompt = response.data;
      if (isDefaultPrompt) {
        saveDefaultPrompt(prompt);
      }
      onPromptCreated(prompt);
      onClose();
    }).catch((error) => {
      setIsLoading(false);
      setErrorMessage(`Error creating prompt: ${error}`);
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Add a prompt</ModalHeader>
        <ModalCloseButton/>
        <ModalBody marginTop={4}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              createPrompt();
            }}
          >
            <Box marginBottom={2}>
              <Heading as='h5' size='sm'>
                Name <span aria-hidden="true" color="red" style={{ color: "red", marginLeft: "4px" }}>*</span>
              </Heading>
            </Box>
            <Box marginBottom={4}>
              <Input
                autoFocus
                id="name"
                type="text"
                value={promptName}
                placeholder='Enter name...'
                onChange={onPromptNameChange}
              />
            </Box>
            <Box marginBottom={2}>
              <Heading as='h5' size='sm'>
                Prompt <span aria-hidden="true" color="red" style={{ color: "red", marginLeft: "4px" }}>*</span>
              </Heading>
            </Box>
            <Box marginBottom={4}>
              <Textarea
                id="content"
                value={promptContent}
                onChange={onPromptContentChange}
                rows={10} // Max 10 textAreaRows
                placeholder='Enter prompt...'
                flexGrow={1}
                fontSize="14px"
                borderWidth="1px"
                borderColor="#3f3f3f"
                borderRadius="10px"
                color="#ffffff"
                px={4}
                _focus={{
                  borderWidth: "1px",
                  borderColor: "blue.500"
                }}
              />
            </Box>
            <Box marginBottom={4}>
              <Checkbox defaultChecked={isDefaultPrompt} onChange={handleCheckboxChange}>Set as default</Checkbox>
            </Box>
            {errorMessage && <Text color={Pink}>{errorMessage}</Text>}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" isLoading={isLoading}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
