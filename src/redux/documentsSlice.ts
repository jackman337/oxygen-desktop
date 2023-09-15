// documentsSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Document } from "../types";
import api from "../auth/apiService";

export const getDocuments = createAsyncThunk<Document[], void, {}>(
  'documents',
  async () => {
    const response = await api.get(`/documents/`);
    return response.data.documents;
  }
);

type DocumentsState = {
  documents: Document[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null | string
};

const initialState: DocumentsState = {
  documents: [],
  status: 'idle',
  error: null
};

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload; // Replace the entire files array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDocuments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload;
      })
      .addCase(getDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export const { setDocuments } = documentsSlice.actions; // Export the new action creator

export default documentsSlice.reducer;
