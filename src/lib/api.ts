import ky from 'ky';
import { telegramUtils } from './telegram';
import type { 
  User, 
  Transaction, 
  RegisterUserInput, 
  TradeInput, 
  RouletteInput, 
  WithdrawalInput,
  TradeResult,
  RouletteResult,
  FuturesInput,
  FuturesResult,
  TradeConfig,
  RouletteConfig,
  FuturesConfig,
  BonusConfig,
  TelegramAuth,
  ApiResponse
} from '../types/api';

// URL для API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Создаем HTTP клиент
const api = ky.create({
  prefixUrl: `${API_URL}/trpc`,
  timeout: 10000,
  retry: {
    limit: 3,
    methods: ['get', 'post'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      request => {
        // Добавляем заголовки для Telegram авторизации
        const initData = telegramUtils.getInitData();
        if (initData) {
          request.headers.set('x-telegram-auth', initData);
        }
        
        const botId = import.meta.env.VITE_BOT_ID || '1';
        request.headers.set('x-bot-id', botId);
      }
    ]
  }
});

// Универсальный tRPC batch-запрос
async function trpcCall<T>(procedure: string, input: any): Promise<T> {
  const res = await api.post(`${procedure}?batch=1`, {
    json: [
      {
        id: 0,
        jsonrpc: "2.0",
        method: procedure,
        params: { input }
      }
    ]
  }).json<any>();
  return res[0]?.result?.data ?? null;
}

// API функции
export const apiClient = {
  // Регистрация пользователя
  async registerUser(input: RegisterUserInput): Promise<ApiResponse<{ userId: number }>> {
    return trpcCall('registerUser', input);
  },

  // Получение пользователя
  async getUser(botId: number, telegramId: string): Promise<User | null> {
    return trpcCall('getUser', { botId, telegramId });
  },

  // Трейдинг
  async trade(input: TradeInput): Promise<ApiResponse<TradeResult>> {
    return trpcCall('trade', input);
  },

  // Рулетка
  async roulette(input: RouletteInput): Promise<ApiResponse<RouletteResult>> {
    return trpcCall('roulette', input);
  },

  // Фьючерсы
  async futures(input: FuturesInput): Promise<ApiResponse<FuturesResult>> {
    return trpcCall('futures', input);
  },

  // Запрос на вывод средств
  async requestWithdrawal(input: WithdrawalInput): Promise<ApiResponse> {
    return trpcCall('requestWithdrawal', input);
  },

  // Получение истории транзакций
  async getTransactionHistory(botId: number, userId: number, limit: number = 10): Promise<Transaction[]> {
    return trpcCall('getTransactionHistory', { botId, userId, limit });
  },

  // Получение конфигурации трейдинга
  async getTradeConfig(botId: number): Promise<{ tradeConfig: TradeConfig }> {
    return trpcCall('getTradeConfig', { botId });
  },

  // Получение конфигурации рулетки
  async getRouletteConfig(botId: number): Promise<{ rouletteConfig: RouletteConfig }> {
    return trpcCall('getRouletteConfig', { botId });
  },

  // Получение конфигурации фьючерсов
  async getFuturesConfig(botId: number): Promise<{ futuresConfig: FuturesConfig }> {
    return trpcCall('getFuturesConfig', { botId });
  },

  // Получение конфигурации бонусов
  async getBonusesConfig(botId: number): Promise<{ bonusConfig: BonusConfig }> {
    return trpcCall('getBonusesConfig', { botId });
  },

  // Получение контакта менеджера
  async getManagerContact(botId: number): Promise<{ managerContact: string }> {
    return trpcCall('getManagerContact', { botId });
  },

  // Получение процента роста пользователя
  async getUserGrowthPercent(botId: number, userId: number): Promise<{ percent: number }> {
    return trpcCall('getUserGrowthPercent', { botId, userId });
  },

  // Авторизация через Telegram
  async authTelegram(auth: TelegramAuth): Promise<ApiResponse<{ user: User }>> {
    return trpcCall('authTelegram', auth);
  },

  // Получение переводов локализации
  async getLocale(locale: string): Promise<{ success: boolean; translations?: Record<string, string>; errorMessage?: string }> {
    return trpcCall('getLocale', { botId: 1, locale });
  },
}; 