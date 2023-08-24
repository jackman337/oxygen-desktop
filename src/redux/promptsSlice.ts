// filesSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Prompt } from "../types";
import api from "../auth/apiService";

export const getPrompts = createAsyncThunk<Prompt[], void, {}>(
  'prompts',
  async () => {
    const response = await api.get(`/prompts/`);
    return response.data.prompts;
  }
);

type PromptsState = {
  prompts: Prompt[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null | string
};

const initialState: PromptsState = {
  prompts: [],
  status: 'idle',
  error: null
};

export const promptsSlice = createSlice({
  name: 'prompts',
  initialState,
  reducers: {
    setPrompts: (state, action: PayloadAction<Prompt[]>) => {
      state.prompts = action.payload; // Replace the entire files array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrompts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPrompts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.prompts = action.payload;
      })
      .addCase(getPrompts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export const { setPrompts } = promptsSlice.actions; // Export the new action creator

export default promptsSlice.reducer;
