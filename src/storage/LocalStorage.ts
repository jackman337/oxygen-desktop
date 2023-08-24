import { Prompt } from "../types";

export const getLanguageModelProvider = (): string => {
  return localStorage.getItem('LANGUAGE_MODEL_PROVIDER') || 'openai';
}

export const saveLanguageModelProvider = (modelProvider: string) => {
  localStorage.setItem('LANGUAGE_MODEL_PROVIDER', modelProvider);
}

export const getLanguageModelName = (): string => {
  return localStorage.getItem('LANGUAGE_MODEL_NAME') || 'gpt-4';
}

export const saveLanguageModelName = (modelName: string) => {
  localStorage.setItem('LANGUAGE_MODEL_NAME', modelName);
}

export const getLanguageModelApiKey = (): string => {
  return localStorage.getItem('LANGUAGE_MODEL_API_KEY') || '';
}

export const saveLanguageModelApiKey = (apiKey: string) => {
  localStorage.setItem('LANGUAGE_MODEL_API_KEY', apiKey);
}

export const getDefaultPrompt = (): Prompt | null => {
  const promptString = localStorage.getItem('DEFAULT_PROMPT');
  if (promptString && promptString !== "undefined") {
    return JSON.parse(promptString) as Prompt;
  }
  return null;
}

export const isDefaultPrompt = (prompt: Prompt | null): boolean => {
  if (prompt == null) return false;

  const promptString = localStorage.getItem('DEFAULT_PROMPT');
  if (promptString && promptString !== "undefined") {
    const defaultPrompt = JSON.parse(promptString) as Prompt;
    return prompt.token === defaultPrompt.token;
  }
  return false;
}

export const saveDefaultPrompt = (prompt: Prompt | null) => {
  if (prompt == null) {
    localStorage.removeItem('DEFAULT_PROMPT');
    return;
  }

  const promptString = JSON.stringify(prompt);
  localStorage.setItem('DEFAULT_PROMPT', promptString);
}