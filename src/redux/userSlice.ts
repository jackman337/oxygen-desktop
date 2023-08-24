import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from "../auth/apiService";

interface UserState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  user: null | { id?: number, username: string, email?: string, refresh?: string, access?: string };
  error: null | string;
}

const initialState: UserState = {
  status: 'idle',
  user: null,
  error: null,
};

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

// define async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { username: string, password: string }, thunkAPI) => {
    try {
      const response = await api.post(`${BASE_URL}/api/login`, credentials);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (credentials: { username: string, password: string }, thunkAPI) => {
    try {
      const response = await api.post(`${BASE_URL}/api/register`, credentials);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'user/refresh',
  async (refreshToken: string) => {
    const response = await api.post(`${BASE_URL}/api/login/refresh`, {refresh: refreshToken});
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      // clear tokens from localStorage
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    },
    loadUser: (state, action: PayloadAction<{ id: number, username: string, email: string }>) => {
      state.user = action.payload;  // update the user state with the loaded user
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ username: string, refresh: string, access: string }>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
        // save tokens to localStorage
        localStorage.setItem('access', action.payload.access);
        localStorage.setItem('refresh', action.payload.refresh);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ username: string, refresh: string, access: string }>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
        // save tokens to localStorage
        localStorage.setItem('access', action.payload.access);
        localStorage.setItem('refresh', action.payload.refresh);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<{ username: string, refresh: string, access: string }>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
  },
});

export const {logout, loadUser} = userSlice.actions;

export default userSlice.reducer;
