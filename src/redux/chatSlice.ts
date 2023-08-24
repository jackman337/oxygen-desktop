// chatSlice.ts

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from "../auth/apiService";
import { Message } from "../types";

export const getChatMessages = createAsyncThunk<Message[], number, {}>(
  'chat/getChatMessages',
  async (chatId: number) => {
    const response = await api.get(`/chats/${chatId}/messages/`);
    return response.data;
  }
);

export const deleteMessages = createAsyncThunk<void, number, {}>(
  'chat/deleteMessages',
  async (chatId: number) => {
    await api.post(`/chats/${chatId}/delete_messages/`);
  }
);

type ChatState = {
  messages: Message[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null | string
};

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  deleteStatus: 'idle',
  error: null
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChatMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = state.messages.concat(action.payload);
      })
      .addCase(getChatMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(deleteMessages.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteMessages.fulfilled, (state) => {
        state.deleteStatus = 'succeeded';
        state.messages = [];
      })
      .addCase(deleteMessages.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});
export default chatSlice.reducer;