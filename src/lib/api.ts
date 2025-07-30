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
  TradeConfig,
  RouletteConfig,
  BonusConfig,
  TelegramAuth,
  ApiResponse
} from '../types/api';

// URL для API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Проверяем, находимся ли мы в production среде без настроенного API URL
const isProductionWithoutApi = import.meta.env.PROD && (!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === 'http://localhost:3000');

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
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve({ success: true, data: { userId: 1 } });
    }
    return api.post('registerUser', { json: input }).json();
  },

  // Получение пользователя
  async getUser(botId: number, telegramId: string): Promise<User | null> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve({
        user_id: 1,
        bot_id: botId,
        telegram_id: telegramId,
        full_name: 'Test User',
        age: 25,
        city: 'Moscow',
        contact: '@test_user',
        account_number: null,
        balance: 1000,
        token_rate: 1,
        level: 'beginner',
        created_at: new Date()
      });
    }
    return api.post('getUser', { json: { botId, telegramId } }).json();
  },

  // Трейдинг
  async trade(input: TradeInput): Promise<ApiResponse<TradeResult>> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      const win = Math.random() > 0.5;
      const amount = Math.random() * 100 - 50;
      return Promise.resolve({ 
        success: true, 
        data: { 
          win,
          amount: Math.abs(amount),
          newBalance: 1000 + amount
        } 
      });
    }
    return api.post('trade', { json: input }).json();
  },

  // Рулетка
  async roulette(input: RouletteInput): Promise<ApiResponse<RouletteResult>> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      const win = Math.random() > 0.5;
      const amount = Math.random() * 100 - 50;
      return Promise.resolve({ 
        success: true, 
        data: { 
          win,
          amount: Math.abs(amount),
          newBalance: 1000 + amount,
          result: Math.floor(Math.random() * 37)
        } 
      });
    }
    return api.post('roulette', { json: input }).json();
  },

  // Запрос на вывод средств
  async requestWithdrawal(input: WithdrawalInput): Promise<ApiResponse> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve({ success: true });
    }
    return api.post('requestWithdrawal', { json: input }).json();
  },

  // Получение истории транзакций
  async getTransactionHistory(botId: number, userId: number, limit: number = 10): Promise<Transaction[]> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve([]);
    }
    return api.post('getTransactionHistory', { json: { botId, userId, limit } }).json();
  },

  // Получение конфигурации трейдинга
  async getTradeConfig(botId: number): Promise<{ tradeConfig: TradeConfig }> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve({
        tradeConfig: {
          maxBetPercent: 10,
          maxBetsPerDay: 50,
          winChance: 0.5,
          tradeDuration: 30
        }
      });
    }
    return api.post('getTradeConfig', { json: { botId } }).json();
  },

  // Получение конфигурации рулетки
  async getRouletteConfig(botId: number): Promise<{ rouletteConfig: RouletteConfig }> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve({
        rouletteConfig: {
          maxBetPercent: 10,
          maxBetsPerDay: 50,
          redChance: 0.486,
          blackChance: 0.486,
          greenChance: 0.028,
          redMultiplier: 2,
          blackMultiplier: 2,
          greenMultiplier: 14
        }
      });
    }
    return api.post('getRouletteConfig', { json: { botId } }).json();
  },

  // Получение конфигурации бонусов
  async getBonusesConfig(botId: number): Promise<{ bonusConfig: BonusConfig }> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve({
        bonusConfig: {
          bonuses: [
            {
              name: 'Welcome Bonus',
              description: 'Welcome bonus for new users',
              amount: 100,
              type: 'welcome'
            },
            {
              name: 'Daily Bonus',
              description: 'Daily login bonus',
              amount: 10,
              type: 'daily'
            },
            {
              name: 'Referral Bonus',
              description: 'Bonus for inviting friends',
              amount: 50,
              type: 'referral'
            }
          ]
        }
      });
    }
    return api.post('getBonusesConfig', { json: { botId } }).json();
  },

  // Получение контакта менеджера
  async getManagerContact(botId: number): Promise<{ managerContact: string }> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve({ managerContact: '@support' });
    }
    return api.post('getManagerContact', { json: { botId } }).json();
  },

  // Получение процента роста пользователя
  async getUserGrowthPercent(botId: number, userId: number): Promise<{ percent: number }> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve({ percent: Math.random() * 100 });
    }
    return api.post('getUserGrowthPercent', { json: { botId, userId } }).json();
  },

  // Авторизация через Telegram
  async authTelegram(auth: TelegramAuth): Promise<ApiResponse<{ user: User }>> {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using mock response.');
      return Promise.resolve({
        success: true,
        data: {
          user: {
            user_id: 1,
            bot_id: 1,
            telegram_id: auth.id,
            full_name: `${auth.first_name} ${auth.last_name || ''}`.trim(),
            age: 25,
            city: 'Moscow',
            contact: auth.username ? `@${auth.username}` : auth.first_name,
            account_number: null,
            balance: 1000,
            token_rate: 1,
            level: 'beginner',
            created_at: new Date()
          }
        }
      });
    }
    return api.post('authTelegram', { json: auth }).json();
  },

  // Получить локализацию с бекенда
  async getLocale(locale: 'ru' | 'en' = 'ru', botId: number = 1) {
    if (isProductionWithoutApi) {
      console.warn('API not configured in production. Using fallback translations.');
      return Promise.resolve({ 
        success: false, 
        errorCode: 'API_NOT_CONFIGURED',
        errorMessage: 'API not configured in production environment'
      });
    }
    return api.post('getLocale', { json: { botId, locale } }).json();
  },
}; 