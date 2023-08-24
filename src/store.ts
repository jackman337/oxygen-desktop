// store.ts

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userSlice';
import chatReducer from './redux/chatSlice';
import filesReducer from './redux/filesSlice';
import promptsReducer from './redux/promptsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    files: filesReducer,
    prompts: promptsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
