export type Agent = {
  id: number;
  name: string;
  model_name: string;
  token: string;
  created_at: string;
};

export type Chat = {
  id: number;
  name: string;
  token: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  sender: string;
  content: string;
};

export interface FileDetails {
  filename: string;
  path: string;
  isActive: boolean;
  isDirectory: boolean | null;
  extension: string | null;
  createdAt: Date | null;
  lastModifiedAt: Date | null;
}

export interface Prompt {
  id: number;
  name: string;
  content: string;
  token: string;
  created_at: string;
  updated_at: string;
}

