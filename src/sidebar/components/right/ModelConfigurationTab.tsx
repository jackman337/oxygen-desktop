import React, { ChangeEvent, useState } from "react";
import { Box, Button, Input, InputGroup, InputRightElement, Select, Spacer, Text, useToast } from "@chakra-ui/react";
import {
  getLanguageModelApiKey,
  getLanguageModelName,
  getLanguageModelProvider,
  saveLanguageModelApiKey,
  saveLanguageModelName,
  saveLanguageModelProvider
} from "../../../storage/LocalStorage";

const ModelConfigurationTab: React.FC = () => {
  const toast = useToast();
  const [modelProvider, setModelProvider] = useState<string>(getLanguageModelProvider());
  const [modelName, setModelName] = useState<string>(getLanguageModelName());
  const [modelApiKey, setModelApiKey] = useState<string>(getLanguageModelApiKey());
  const [showModelApiKey, setShowModelApiKey] = useState<boolean>(false);

  const onApiKeyVisibilityClick = () => setShowModelApiKey(!showModelApiKey)

  const onModelProviderChange = (event: ChangeEvent<{ value: unknown }>) => {
    setModelProvider(event.target.value as string);
  };

  const onModelNameChange = (event: ChangeEvent<{ value: unknown }>) => {
    console.log(event.target.value as string)
    setModelName(event.target.value as string);
  };

  const onModelApiKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setModelApiKey(event.target.value);
  };

  const onSaveClicked = () => {
    // Save the values in local storage
    saveLanguageModelProvider(modelProvider);
    saveLanguageModelName(modelName);
    saveLanguageModelApiKey(modelApiKey);

    // Show success message
    toast({
      title: "Success",
      description: "Model configurations have been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Spacer height="20px"/>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSaveClicked();
        }}
      >
        <Box marginBottom={2}>
          <Text fontSize="14px">Provider</Text>
        </Box>
        <Box marginBottom={4}>
          <Select value={modelProvider} onChange={onModelProviderChange} iconColor="white">
            <option value="openai">OpenAI</option>
          </Select>
        </Box>
        <Box marginBottom={2}>
          <Text fontSize="14px">Name</Text>
        </Box>
        <Box marginBottom={4}>
          <Select value={modelName} onChange={onModelNameChange} iconColor="white">
            <option value="gpt-3.5-turbo">GPT-3.5</option>
            <option value="gpt-4">GPT-4</option>
          </Select>
        </Box>
        <Box marginBottom={2}>
          <Text fontSize="14px">API Key</Text>
        </Box>
        <Box marginBottom={4}>
          <InputGroup size='md'>
            <Input
              pr='4.5rem'
              type={showModelApiKey ? 'text' : 'password'}
              value={modelApiKey}
              onChange={onModelApiKeyChange}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={onApiKeyVisibilityClick}>
                {showModelApiKey ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
        <Spacer height="20px"/>
        <Box>
          <Button type="submit" variant='outlinedWhite' width="100%">
            Save
          </Button>
        </Box>
      </form>
      <Spacer height="20px"/>
    </Box>
  )
}

export default ModelConfigurationTab
