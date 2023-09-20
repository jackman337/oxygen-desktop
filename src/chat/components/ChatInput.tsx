import React, { useRef, useState } from 'react';
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Textarea, useToast } from "@chakra-ui/react";
import { Message } from "../../types";
import { getLanguageModelApiKey } from "../../storage/LocalStorage";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { BorderColor, White } from '../../styles/colors';

type ChatInputProps = {
  onNewUserMessage: (message: Message, codeFileNames: string[]) => void;
};

type AutoCompleteSuggestion = {
  filename: string,
  path: string,
}

export const ChatInput: React.FC<ChatInputProps> = ({ onNewUserMessage }) => {
  const [message, setMessage] = useState('');
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const [textAreaRows, setTextAreaRows] = useState(1);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const projectFiles = useSelector((state: RootState) => state.files.projectFiles);
  const toast = useToast();

  // A filtered subset of suggestions based on the user's input after the '@' symbol
  const [filteredSuggestions, setFilteredSuggestions] = useState<AutoCompleteSuggestion[]>([]);

  // References
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const calculateRows = (text: string) => {
    return text.split('\n').length;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const llmApiKey = getLanguageModelApiKey();
    if (llmApiKey.length === 0) {
      toast({
        title: "Error",
        description: "Please set a valid API Key in the Model configuration tab.",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
      return;
    }

    if (message.trim() === '') {
      return;
    }

    const newMessage = { sender: 'USER', content: message };
    const codeFileNames = parseCodeFileNames(message);
    onNewUserMessage(newMessage, codeFileNames)
    setMessage(''); // Clear the input message
    setTextAreaRows(1); // Reset the number of textAreaRows
  }

  const computeCaretPosition = (): { top: number, left: number } => {
    if (!textAreaRef.current) return { top: 0, left: 0 };

    const textArea = textAreaRef.current;
    const textUpToCaret = textArea.value.substring(0, textArea.selectionEnd);
    const lastNewLineIndex = textUpToCaret.lastIndexOf("\n");

    let currentLine = textUpToCaret;
    if (lastNewLineIndex !== -1) {
      currentLine = textUpToCaret.substring(lastNewLineIndex + 1);
    }

    const textWidthUpToCaret = getStringWidth(currentLine);
    const textAreaPosition = textArea.getBoundingClientRect();

    return {
      top: textAreaPosition.top - 200,
      left: textAreaPosition.left + textWidthUpToCaret
    };
  };

  const getStringWidth = (str: string, font = '14px sans-serif') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      const metrics = context.measureText(str);
      return metrics.width;
    }
    return 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    const words = inputText.split(/\s+/);
    if (words.length === 0) {
      setIsAutocompleteOpen(false);
      setFilteredSuggestions([]);
    } else if (words[words.length - 1].startsWith('@')) {
      setMenuPosition(computeCaretPosition());
      setIsAutocompleteOpen(true);
      setFilteredSuggestions(projectFiles.filter(file => {
          let filename = file.filename.toLowerCase();
          let inputWord = words[words.length - 1].substring(1); // Remove the '@' symbol
          return filename.startsWith(inputWord.toLowerCase());
        })
      )
    } else {
      setIsAutocompleteOpen(false);
      setFilteredSuggestions([]);
    }

    setTextAreaRows(calculateRows(inputText));
    setMessage(inputText);
  };

  const handleSelect = (filename: string) => {
    const newMessage = message.replace(/@[^ ]*$/, `@${filename}`);
    setMessage(newMessage);
    setIsAutocompleteOpen(false);
  };

  const parseCodeFileNames = (text: string): string[] => {
    const words = text.split(' ');
    const atMentions = words.filter(word => word.startsWith('@'));
    const codeFiles = atMentions.map(atMention => atMention.substring(1))

    // Strip away any trailing non-alphanumeric characters from each codeFile
    return codeFiles.map(codeFile => {
      const lastChar = codeFile[codeFile.length - 1];
      if (!lastChar.match(/[a-z0-9]/i)) {
        return codeFile.substring(0, codeFile.length - 1);
      }
      return codeFile;
    });
  }

  return (
    <Box as="form" onSubmit={handleSubmit} display="flex" alignItems="flex-start" p={2} borderTop="1px"
         borderColor="#3f3f3f">
      <Menu
        isOpen={isAutocompleteOpen && filteredSuggestions.length > 0}
        onClose={() => setIsAutocompleteOpen(false)}
      >
        <MenuButton as={Button} display="none"/>
        <MenuList
          position="absolute"
          top={`${menuPosition.top}px`}
          left={`${menuPosition.left}px`}
          backgroundColor="#333333"
          border="none"
          height="180px"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <MenuItem
              key={index}
              onClick={() => handleSelect(suggestion.filename)}
              backgroundColor="#333333"
              textColor="white"
              fontSize="14px"
              _hover={{ backgroundColor: "#3f3f3f" }}
            >
              {suggestion.filename}
            </MenuItem>
          )).slice(0, 5)}
        </MenuList>
      </Menu>
      <Textarea
        ref={textAreaRef}
        value={message}
        onChange={handleChange}
        fontSize="14px"
        rows={Math.min(textAreaRows, 10)} // Max 10 textAreaRows
        placeholder="Type a message...Use '@' to include files in your message"
        size="md"
        resize="none"
        maxH="500px"
        minH="14px"
        mr={2}
        flexGrow={1}
        borderColor={BorderColor}
        borderRadius="10px"
        color={White}
        p={2}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
          }
        }}
      />
      <Button colorScheme="green" type="submit" w="100px" p={2} borderRadius="10px" alignSelf="flex-end">
        Send
      </Button>
      <div
        id="textarea-mirror"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflow: 'hidden',
          height: 'auto',
          width: 'auto',
          boxSizing: 'border-box',
          padding: '2px',
          fontSize: '14px',
          lineHeight: '14px',
        }}
      ></div>
    </Box>
  );
};