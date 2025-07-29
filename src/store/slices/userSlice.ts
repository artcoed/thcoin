import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, RegisterUserInput } from '../../types/api';
import { apiClient } from '../../lib/api';
import { telegramUtils } from '../../lib/telegram';

interface UserState {
  user: User | null;
  isRegistered: boolean;
  loading: boolean;
  error: string | null;
  botId: number;
}

const initialState: UserState = {
  user: null,
  isRegistered: false,
  loading: false,
  error: null,
  botId: Number(import.meta.env.VITE_BOT_ID) || 1,
};

// Async thunks
export const registerUser = createAsyncThunk(
  'user/register',
  async (input: Omit<RegisterUserInput, 'botId'>, { getState }) => {
    const state = getState() as { user: UserState };
    const fullInput = { ...input, botId: state.user.botId };
    const response = await apiClient.registerUser(fullInput);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.errorMessage || 'Registration failed');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (telegramId: string, { getState }) => {
    const state = getState() as { user: UserState };
    const user = await apiClient.getUser(state.user.botId, telegramId);
    return user;
  }
);

export const fetchUserByTelegram = createAsyncThunk(
  'user/fetchByTelegram',
  async (_, { getState }) => {
    const state = getState() as { user: UserState };
    const telegramId = telegramUtils.getTelegramId();
    if (!telegramId) {
      throw new Error('Telegram ID not available');
    }
    const user = await apiClient.getUser(state.user.botId, telegramId);
    return user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isRegistered = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isRegistered = false;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.balance = action.payload;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isRegistered = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isRegistered = true;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(fetchUserByTelegram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByTelegram.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isRegistered = true;
        }
      })
      .addCase(fetchUserByTelegram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user from Telegram';
      });
  },
});

export const { setUser, clearUser, updateBalance, setError, clearError } = userSlice.actions;
export default userSlice.reducer; 