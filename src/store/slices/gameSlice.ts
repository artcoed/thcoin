import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TradeInput, RouletteInput, FuturesInput, TradeResult, RouletteResult, FuturesResult } from '../../types/api';
import { apiClient } from '../../lib/api';

interface GameState {
  tradeLoading: boolean;
  rouletteLoading: boolean;
  futuresLoading: boolean;
  tradeError: string | null;
  rouletteError: string | null;
  futuresError: string | null;
  lastTradeResult: TradeResult | null;
  lastRouletteResult: RouletteResult | null;
  lastFuturesResult: FuturesResult | null;
  dailyTradesCount: number;
  dailyRouletteCount: number;
  dailyFuturesCount: number;
}

const initialState: GameState = {
  tradeLoading: false,
  rouletteLoading: false,
  futuresLoading: false,
  tradeError: null,
  rouletteError: null,
  futuresError: null,
  lastTradeResult: null,
  lastRouletteResult: null,
  lastFuturesResult: null,
  dailyTradesCount: 0,
  dailyRouletteCount: 0,
  dailyFuturesCount: 0,
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

export const executeFutures = createAsyncThunk(
  'game/futures',
  async (input: Omit<FuturesInput, 'botId'>, { getState }) => {
    const state = getState() as { user: { botId: number } };
    const fullInput = { ...input, botId: state.user.botId };
    const response = await apiClient.futures(fullInput);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.errorMessage || 'Futures failed');
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
    clearFuturesError: (state) => {
      state.futuresError = null;
    },
    clearLastResults: (state) => {
      state.lastTradeResult = null;
      state.lastRouletteResult = null;
      state.lastFuturesResult = null;
    },
    incrementDailyTrades: (state) => {
      state.dailyTradesCount += 1;
    },
    incrementDailyRoulette: (state) => {
      state.dailyRouletteCount += 1;
    },
    incrementDailyFutures: (state) => {
      state.dailyFuturesCount += 1;
    },
    resetDailyCounts: (state) => {
      state.dailyTradesCount = 0;
      state.dailyRouletteCount = 0;
      state.dailyFuturesCount = 0;
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
      })
      // Futures cases
      .addCase(executeFutures.pending, (state) => {
        state.futuresLoading = true;
        state.futuresError = null;
      })
      .addCase(executeFutures.fulfilled, (state, action) => {
        state.futuresLoading = false;
        state.lastFuturesResult = action.payload || null;
        state.dailyFuturesCount += 1;
      })
      .addCase(executeFutures.rejected, (state, action) => {
        state.futuresLoading = false;
        state.futuresError = action.error.message || 'Futures failed';
      });
  },
});

export const { 
  clearTradeError, 
  clearRouletteError, 
  clearFuturesError, 
  clearLastResults, 
  incrementDailyTrades, 
  incrementDailyRoulette, 
  incrementDailyFutures, 
  resetDailyCounts 
} = gameSlice.actions;

export default gameSlice.reducer; 