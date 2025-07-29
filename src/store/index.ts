import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import gameReducer from './slices/gameSlice';
import configReducer from './slices/configSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    game: gameReducer,
    config: configReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем определенные типы действий для сериализации
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 