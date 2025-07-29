import React, { useEffect } from "react";
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./App.css";
import { AppProvider, useAppContext } from "./context/AppContext";
import { store } from "./store";
import { queryClient } from "./lib/react-query";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchUserByTelegram } from "./store/slices/userSlice";
import { telegramUtils } from "./lib/telegram";
import { i18n } from "./lib/i18n";
import MainPage from "./components/MainPage";
import RouletteRegistrationBlock from "./components/RouletteRegistrationBlock";
import Futures from "./components/Futures";
import RouletteWindow from "./components/RouletteWindow";
import Bonuses from "./components/Bonuses";
import Manager from "./components/Manager";
import History from "./components/History";

function AppContent() {
  const { currentPage } = useAppContext();
  const dispatch = useAppDispatch();
  const { user, isRegistered, loading } = useAppSelector(state => state.user);

  // Инициализируем локализацию при загрузке приложения
  useEffect(() => {
    i18n.init();
  }, []);

  // Проверяем пользователя при загрузке приложения
  useEffect(() => {
    if (telegramUtils.isTelegramWebApp() && !user && !loading) {
      dispatch(fetchUserByTelegram());
    }
  }, [dispatch, user, loading]);

  // Если пользователь не зарегистрирован, показываем регистрацию
  if (!isRegistered && !user) {
    return <RouletteRegistrationBlock />;
  }

  // Отображаем соответствующую страницу
  switch (currentPage) {
    case 'registration':
      return <RouletteRegistrationBlock />;
    case 'main':
      return <MainPage />;
    case 'futures':
      return <Futures />;
    case 'roulette':
      return <RouletteWindow />;
    case 'bonuses':
      return <Bonuses />;
    case 'manager':
      return <Manager />;
    case 'history':
      return <History />;
    default:
      return <MainPage />;
  }
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <div className="app">
            <AppContent />
          </div>
        </AppProvider>
      </QueryClientProvider>
    </Provider>
  );
}
