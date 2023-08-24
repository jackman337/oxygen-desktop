// preload.ts

import { contextBridge, ipcRenderer } from 'electron';
import { FileDetails } from "./src/types";

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: async (): Promise<string> => {
    return ipcRenderer.invoke('get-app-version');
  },
  readFile: async (fileName: string): Promise<string> => {
    return ipcRenderer.invoke('read-file', fileName);
  },
  readDir: async (path: string): Promise<string[]> => {
    return ipcRenderer.invoke('read-dir', path);
  },
  isDirectory: async (path: string): Promise<boolean> => { // Add this block
    return ipcRenderer.invoke('is-directory', path);
  },
  stat: async (path: string): Promise<any> => { // Update the return type according to your needs
    return ipcRenderer.invoke('stat', path);
  },
  onUpdateAvailable: (listener: () => void): void => {
    ipcRenderer.on('update_available', listener);
  },
  onUpdateDownloaded: (listener: () => void): void => {
    ipcRenderer.on('update_downloaded', listener);
  },
  removeAllListeners: (channel: string): void => {
    ipcRenderer.removeAllListeners(channel);
  },
  installUpdate: (): void => {
    ipcRenderer.send('installUpdate');
  },
  upsertFileMetadata: async (fileDetails: FileDetails): Promise<any> => {
    return ipcRenderer.invoke('upsert-file-details', fileDetails);
  },
  deleteFile: async (path: string): Promise<void> => {
    return ipcRenderer.invoke('delete-file', path);
  },
  getAllFiles: async (): Promise<FileDetails[]> => {
    return ipcRenderer.invoke('get-all-files');
  },
  getFileDetails: async (path: string): Promise<FileDetails> => {
    return ipcRenderer.invoke('get-file-details', path);
  },
});
