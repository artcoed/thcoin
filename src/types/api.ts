// Типы для пользователя
export interface User {
  user_id: number;
  bot_id: number;
  telegram_id: string;
  full_name: string;
  age: number;
  city: string;
  contact: string;
  account_number: string | null;
  balance: number;
  token_rate: number;
  level: string;
  created_at: Date;
}

// Типы для транзакций
export interface Transaction {
  transaction_id: number;
  bot_id: number;
  user_id: number;
  amount: number;
  type: "deposit" | "trade" | "bonus" | "withdrawal" | "roulette";
  status: "pending" | "completed" | "rejected";
  withdrawal_account: string | null;
  withdrawal_status_updated_at: Date | null;
  created_at: Date;
}

// Типы для бонусов
export interface Bonus {
  bonus_id: number;
  bot_id: number;
  user_id: number;
  amount: number;
  description: string;
  created_at: Date;
}

// Типы для ботов
export interface Bot {
  bot_id: number;
  token: string;
  name: string;
  currency: string;
  created_at: Date;
}

// Типы для конфигурации
export interface Config {
  config_id: number;
  bot_id: number;
  key: string;
  value: unknown;
  updated_at: Date;
}

// Типы для ответов API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
}

// Типы для регистрации
export interface RegisterUserInput {
  botId: number;
  telegramId: string;
  fullName: string;
  age: number;
  city: string;
  contact: string;
  accountNumber: string;
}

// Типы для трейдинга
export interface TradeInput {
  botId: number;
  userId: number;
  amount: number;
  direction: "up" | "down";
}

export interface TradeResult {
  win: boolean;
  amount: number;
  newBalance: number;
}

// Типы для рулетки
export interface RouletteInput {
  botId: number;
  userId: number;
  amount: number;
  choice: "red" | "black" | "green";
}

export interface RouletteResult {
  win: boolean;
  amount: number;
  newBalance: number;
  result: number;
}

// Типы для вывода средств
export interface WithdrawalInput {
  botId: number;
  userId: number;
  amount: number;
  accountNumber: string;
}

// Типы для конфигурации игр
export interface TradeConfig {
  maxBetPercent: number;
  maxBetsPerDay: number;
  winChance: number;
  tradeDuration: number;
}

export interface RouletteConfig {
  maxBetPercent: number;
  maxBetsPerDay: number;
  redChance: number;
  blackChance: number;
  greenChance: number;
  redMultiplier: number;
  blackMultiplier: number;
  greenMultiplier: number;
}

export interface BonusConfig {
  bonuses: Array<{
    name: string;
    description: string;
    amount: number;
    type: string;
  }>;
}

// Типы для Telegram авторизации
export interface TelegramAuth {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
} 