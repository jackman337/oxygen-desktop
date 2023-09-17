// store.ts

import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './redux/chatSlice';
import documentsReducer from './redux/documentsSlice';
import filesReducer from './redux/filesSlice';
import promptsReducer from './redux/promptsSlice';
import userReducer from './redux/userSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    documents: documentsReducer,
    files: filesReducer,
    prompts: promptsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
