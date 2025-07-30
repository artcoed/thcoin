import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TradeConfig, RouletteConfig, FuturesConfig, BonusConfig } from '../../types/api';
import { apiClient } from '../../lib/api';

interface ConfigState {
  tradeConfig: TradeConfig | null;
  rouletteConfig: RouletteConfig | null;
  futuresConfig: FuturesConfig | null;
  bonusConfig: BonusConfig | null;
  managerContact: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  tradeConfig: null,
  rouletteConfig: null,
  futuresConfig: null,
  bonusConfig: null,
  managerContact: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchTradeConfig = createAsyncThunk(
  'config/fetchTrade',
  async (_, { getState }) => {
    const state = getState() as { user: { botId: number } };
    const response = await apiClient.getTradeConfig(state.user.botId);
    return response.tradeConfig;
  }
);

export const fetchRouletteConfig = createAsyncThunk(
  'config/fetchRoulette',
  async (_, { getState }) => {
    const state = getState() as { user: { botId: number } };
    const response = await apiClient.getRouletteConfig(state.user.botId);
    return response.rouletteConfig;
  }
);

export const fetchFuturesConfig = createAsyncThunk(
  'config/fetchFutures',
  async (_, { getState }) => {
    const state = getState() as { user: { botId: number } };
    const response = await apiClient.getFuturesConfig(state.user.botId);
    return response.futuresConfig;
  }
);

export const fetchBonusConfig = createAsyncThunk(
  'config/fetchBonus',
  async (_, { getState }) => {
    const state = getState() as { user: { botId: number } };
    const response = await apiClient.getBonusesConfig(state.user.botId);
    return response.bonusConfig;
  }
);

export const fetchManagerContact = createAsyncThunk(
  'config/fetchManager',
  async (_, { getState }) => {
    const state = getState() as { user: { botId: number } };
    const response = await apiClient.getManagerContact(state.user.botId);
    return response.managerContact;
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTradeConfig: (state, action: PayloadAction<TradeConfig>) => {
      state.tradeConfig = action.payload;
    },
    setRouletteConfig: (state, action: PayloadAction<RouletteConfig>) => {
      state.rouletteConfig = action.payload;
    },
    setFuturesConfig: (state, action: PayloadAction<FuturesConfig>) => {
      state.futuresConfig = action.payload;
    },
    setBonusConfig: (state, action: PayloadAction<BonusConfig>) => {
      state.bonusConfig = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Trade config
      .addCase(fetchTradeConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTradeConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.tradeConfig = action.payload;
      })
      .addCase(fetchTradeConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trade config';
      })
      // Roulette config
      .addCase(fetchRouletteConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRouletteConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.rouletteConfig = action.payload;
      })
      .addCase(fetchRouletteConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch roulette config';
      })
      // Futures config
      .addCase(fetchFuturesConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFuturesConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.futuresConfig = action.payload;
      })
      .addCase(fetchFuturesConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch futures config';
      })
      // Bonus config
      .addCase(fetchBonusConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBonusConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.bonusConfig = action.payload;
      })
      .addCase(fetchBonusConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bonus config';
      })
      // Manager contact
      .addCase(fetchManagerContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerContact.fulfilled, (state, action) => {
        state.loading = false;
        state.managerContact = action.payload;
      })
      .addCase(fetchManagerContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch manager contact';
      });
  },
});

export const { clearError, setTradeConfig, setRouletteConfig, setFuturesConfig, setBonusConfig } = configSlice.actions;
export default configSlice.reducer; 