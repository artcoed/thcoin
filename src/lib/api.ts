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

// API функции
export const apiClient = {
  // Регистрация пользователя
  async registerUser(input: RegisterUserInput): Promise<ApiResponse<{ userId: number }>> {
    return api.post('registerUser', { json: input }).json();
  },

  // Получение пользователя
  async getUser(botId: number, telegramId: string): Promise<User | null> {
    return api.post('getUser', { json: { botId, telegramId } }).json();
  },

  // Трейдинг
  async trade(input: TradeInput): Promise<ApiResponse<TradeResult>> {
    return api.post('trade', { json: input }).json();
  },

  // Рулетка
  async roulette(input: RouletteInput): Promise<ApiResponse<RouletteResult>> {
    return api.post('roulette', { json: input }).json();
  },

  // Фьючерсы
  async futures(input: FuturesInput): Promise<ApiResponse<FuturesResult>> {
    return api.post('futures', { json: input }).json();
  },

  // Запрос на вывод средств
  async requestWithdrawal(input: WithdrawalInput): Promise<ApiResponse> {
    return api.post('requestWithdrawal', { json: input }).json();
  },

  // Получение истории транзакций
  async getTransactionHistory(botId: number, userId: number, limit: number = 10): Promise<Transaction[]> {
    return api.post('getTransactionHistory', { json: { botId, userId, limit } }).json();
  },

  // Получение конфигурации трейдинга
  async getTradeConfig(botId: number): Promise<{ tradeConfig: TradeConfig }> {
    return api.post('getTradeConfig', { json: { botId } }).json();
  },

  // Получение конфигурации рулетки
  async getRouletteConfig(botId: number): Promise<{ rouletteConfig: RouletteConfig }> {
    return api.post('getRouletteConfig', { json: { botId } }).json();
  },

  // Получение конфигурации фьючерсов
  async getFuturesConfig(botId: number): Promise<{ futuresConfig: FuturesConfig }> {
    return api.post('getFuturesConfig', { json: { botId } }).json();
  },

  // Получение конфигурации бонусов
  async getBonusesConfig(botId: number): Promise<{ bonusConfig: BonusConfig }> {
    return api.post('getBonusesConfig', { json: { botId } }).json();
  },

  // Получение контакта менеджера
  async getManagerContact(botId: number): Promise<{ managerContact: string }> {
    return api.post('getManagerContact', { json: { botId } }).json();
  },

  // Получение процента роста пользователя
  async getUserGrowthPercent(botId: number, userId: number): Promise<{ percent: number }> {
    return api.post('getUserGrowthPercent', { json: { botId, userId } }).json();
  },

  // Авторизация через Telegram
  async authTelegram(auth: TelegramAuth): Promise<ApiResponse<{ user: User }>> {
    return api.post('authTelegram', { json: auth }).json();
  },

  // Получение переводов локализации
  async getLocale(locale: string): Promise<{ success: boolean; translations?: Record<string, string>; errorMessage?: string }> {
    return api.post('getLocale', { json: { botId: 1, locale } }).json();
  },
}; 