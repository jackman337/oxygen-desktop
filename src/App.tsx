// App.tsx

import React, { useEffect, useState } from 'react';
import { Box, ChakraProvider } from "@chakra-ui/react";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./store";
import ChatPage from "./chat/components/ChatPage";
import './styles/styles.css';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { SplashPage } from "./auth/components/SplashPage";
import { LoginPage } from "./auth/components/LoginPage";
import { RegisterPage } from "./auth/components/RegisterPage";
import { UpdateAppModalModal } from "./update/UpdateAppModal";
import { loadUserFromLocalStorage } from "./auth/authService";
import { chakraTheme } from './styles/themes';
import { BackgroundColor } from "./styles/colors";
import { FileDetails } from "./types";

declare global {
  interface Window {
    electron: {
      readFile: (fileName: string) => Promise<string>;
      readDir: (path: string) => Promise<string[]>;
      isDirectory: (path: string) => Promise<boolean>;
      stat: (path: string) => Promise<any>;
      getAppVersion: () => Promise<string>;
      onUpdateAvailable: (listener: () => void) => void;
      onUpdateDownloaded: (listener: () => void) => void;
      removeAllListeners: (channel: string) => void;
      installUpdate: () => void;
      upsertFileMetadata: (fileDetails: FileDetails) => Promise<any>;
      deleteFile: (path: string) => Promise<void>;
      getAllFiles: () => Promise<FileDetails[]>;
      getFileMetadata: (path: string) => Promise<FileDetails>;
    }
  }
}

const App: React.FC = () => {
  return (
    <ChakraProvider theme={chakraTheme}>
      <Provider store={store}>
        <Router>
          <Home/>
        </Router>
      </Provider>
    </ChakraProvider>
  );
}

const Home = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.user); // get the user state

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  // Get app version and register for app updates
  useEffect(() => {
    window.electron.getAppVersion().then((version: string) => {
      localStorage.setItem('appVersion', version);
    });

    window.electron.onUpdateAvailable(() => {
      setIsUpdateAvailable(true);
    });

    window.electron.onUpdateDownloaded(() => {
      setUpdateDownloaded(true);
    });

    // Cleanup listeners when the component unmounts
    return () => {
      window.electron.removeAllListeners('update_available');
      window.electron.removeAllListeners('update_downloaded');
    };
  }, []);

  // Load the user if one exists
  useEffect(() => {
    loadUserFromLocalStorage();
  }, []);

  const handleUpdate = () => {
    window.electron.installUpdate();
  };

  // If user is not logged in, redirect to LoginPage or RegisterPage
  if (user === null && !['/login', '/register'].includes(location.pathname)) {
    return (
      <Box>
        <UpdateAppModalModal isOpen={isUpdateAvailable} onUpdateClick={handleUpdate}/>
        <Routes>
          <Route path="/" element={<SplashPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
      </Box>
    )
  }

  // If user is logged in, display Sidebar and set AgentPage as default
  return (
    <Box display='flex' bg={BackgroundColor}>
      <UpdateAppModalModal isOpen={isUpdateAvailable} onUpdateClick={handleUpdate}/>
      <Routes>
        <Route path="/" element={<ChatPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
    </Box>
  );
};

export default App;
