// filesSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileDetails } from "../types";

type FilesState = {
  projectFiles: FileDetails[],
};

const initialState: FilesState = {
  projectFiles: [],
};

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setProjectFiles: (state, action: PayloadAction<FileDetails[]>) => {
      state.projectFiles = action.payload; // Replace the entire files array
    },
  },
});

export const { setProjectFiles } = filesSlice.actions; // Export the new action creator

export default filesSlice.reducer;
