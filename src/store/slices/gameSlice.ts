import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TradeInput, RouletteInput, TradeResult, RouletteResult } from '../../types/api';
import { apiClient } from '../../lib/api';

interface GameState {
  tradeLoading: boolean;
  rouletteLoading: boolean;
  tradeError: string | null;
  rouletteError: string | null;
  lastTradeResult: TradeResult | null;
  lastRouletteResult: RouletteResult | null;
  dailyTradesCount: number;
  dailyRouletteCount: number;
}

const initialState: GameState = {
  tradeLoading: false,
  rouletteLoading: false,
  tradeError: null,
  rouletteError: null,
  lastTradeResult: null,
  lastRouletteResult: null,
  dailyTradesCount: 0,
  dailyRouletteCount: 0,
};

// Async thunks
export const executeTrade = createAsyncThunk(
  'game/trade',
  async (input: Omit<TradeInput, 'botId'>, { getState }) => {
    const state = getState() as { user: { botId: number } };
    const fullInput = { ...input, botId: state.user.botId };
    const response = await apiClient.trade(fullInput);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.errorMessage || 'Trade failed');
    }
  }
);

export const executeRoulette = createAsyncThunk(
  'game/roulette',
  async (input: Omit<RouletteInput, 'botId'>, { getState }) => {
    const state = getState() as { user: { botId: number } };
    const fullInput = { ...input, botId: state.user.botId };
    const response = await apiClient.roulette(fullInput);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.errorMessage || 'Roulette failed');
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clearTradeError: (state) => {
      state.tradeError = null;
    },
    clearRouletteError: (state) => {
      state.rouletteError = null;
    },
    clearLastResults: (state) => {
      state.lastTradeResult = null;
      state.lastRouletteResult = null;
    },
    incrementDailyTrades: (state) => {
      state.dailyTradesCount += 1;
    },
    incrementDailyRoulette: (state) => {
      state.dailyRouletteCount += 1;
    },
    resetDailyCounts: (state) => {
      state.dailyTradesCount = 0;
      state.dailyRouletteCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Trade cases
      .addCase(executeTrade.pending, (state) => {
        state.tradeLoading = true;
        state.tradeError = null;
      })
      .addCase(executeTrade.fulfilled, (state, action) => {
        state.tradeLoading = false;
        state.lastTradeResult = action.payload || null;
        state.dailyTradesCount += 1;
      })
      .addCase(executeTrade.rejected, (state, action) => {
        state.tradeLoading = false;
        state.tradeError = action.error.message || 'Trade failed';
      })
      // Roulette cases
      .addCase(executeRoulette.pending, (state) => {
        state.rouletteLoading = true;
        state.rouletteError = null;
      })
      .addCase(executeRoulette.fulfilled, (state, action) => {
        state.rouletteLoading = false;
        state.lastRouletteResult = action.payload || null;
        state.dailyRouletteCount += 1;
      })
      .addCase(executeRoulette.rejected, (state, action) => {
        state.rouletteLoading = false;
        state.rouletteError = action.error.message || 'Roulette failed';
      });
  },
});

export const { 
  clearTradeError, 
  clearRouletteError, 
  clearLastResults, 
  incrementDailyTrades, 
  incrementDailyRoulette, 
  resetDailyCounts 
} = gameSlice.actions;

export default gameSlice.reducer; 