import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Page = 'registration' | 'main' | 'futures' | 'roulette' | 'bonuses' | 'manager' | 'history';

interface AppContextType {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  goBack: () => void;
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
  userData: {
    id: string;
    name: string;
    balance: number;
    tokenRate: number;
    status: string;
    iban?: string;
  } | null;
  setUserData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('registration');
  const [pageHistory, setPageHistory] = useState<Page[]>(['registration']);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const navigateTo = (page: Page) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = pageHistory.slice(0, -1);
      setPageHistory(newHistory);
      setCurrentPage(newHistory[newHistory.length - 1]);
    } else {
      // Если нет истории, возвращаемся на главную
      setCurrentPage('main');
      setPageHistory(['main']);
    }
  };

  const value: AppContextType = {
    currentPage,
    navigateTo,
    goBack,
    isRegistered,
    setIsRegistered,
    userData,
    setUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 