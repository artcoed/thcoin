import { FluentBundle, FluentResource } from '@fluent/bundle';

// Ресурсы локализации
const ruResource = new FluentResource(`
# Общие
app-title = Торговая платформа
loading = Загрузка...
error = Ошибка
success = Успешно
cancel = Отмена
confirm = Подтвердить
back = Назад

# Регистрация
registration-title = Регистрация
registration-fullname = ФИО
registration-age = Возраст
registration-city = Город
registration-phone = Телефон
registration-iban = Номер счета IBAN
registration-button = Зарегистрироваться
registration-loading = Регистрация...
registration-error-fields = Пожалуйста, заполните все поля
registration-error-telegram = Ошибка: не удалось получить данные пользователя

# Главная страница
main-balance = БАЛАНС КОШЕЛЬКА
main-daily-dynamics = Динамика за сутки
main-trading = Трейдинг
main-roulette = Рулетка
main-bonuses = Бонусы
main-withdraw = Вывод
main-manager = Менеджер
main-history = История

# Навигация
nav-withdraw = Вывод
nav-manager = Менеджер
nav-history = История

# Трейдинг
trading-title = BaseCoin
trading-bet-size = Размер ставки
trading-attempts = { $current }/{ $max } попыток
trading-min-bet = Мин: { $amount }
trading-max-bet = Макс: { $amount }
trading-up = Вверх
trading-down = Вниз
trading-processing = Обработка...
trading-error-user = Пользователь не найден
trading-error-config = Конфигурация трейдинга не загружена
trading-error-limit = Достигнут лимит ставок на день: { $max }
trading-error-max-bet = Максимальная ставка: { $amount } ({ $percent }% от баланса)
trading-error-insufficient = Недостаточно средств
trading-success = Ставка принята!
trading-error-execution = Ошибка при выполнении ставки

# Рулетка
roulette-title = Рулетка
roulette-red = Красное
roulette-black = Черное
roulette-green = Зеленое
roulette-spinning = Крутится...
roulette-bet-size = Размер ставки
roulette-attempts = { $current }/{ $max } попыток
roulette-min-bet = Мин: { $amount }
roulette-max-bet = Макс: { $amount }
roulette-error-user = Пользователь не найден
roulette-error-config = Конфигурация рулетки не загружена
roulette-error-limit = Достигнут лимит ставок на день: { $max }
roulette-error-max-bet = Максимальная ставка: { $amount } ({ $percent }% от баланса)
roulette-error-insufficient = Недостаточно средств
roulette-success = Ставка принята!
roulette-error-execution = Ошибка при выполнении ставки

# Модалки результатов
result-win-title = Победа!
result-lose-title = Проигрыш
result-win-amount = Вы выиграли { $amount }€
result-lose-amount = Вы проиграли { $amount }€
result-time-remaining = Осталось времени: { $time }
result-continue = Продолжить

# Вывод средств
withdraw-title = Вывод средств
withdraw-available = Доступно для вывода: { $amount }€
withdraw-confirm = Вы хотите вывести всю сумму?
withdraw-no = Нет
withdraw-yes = Да
withdraw-processing = Обработка...
withdraw-success = Вывод в обработке, подробности уточните у менеджера

# Бонусы
bonuses-title = Бонусы
bonuses-available = Доступные бонусы
bonuses-claimed = Полученные бонусы

# Менеджер
manager-title = Менеджер
manager-contact = Связаться с менеджером
manager-telegram = Написать в Telegram

# История
history-title = История операций
history-deposit = Депозит
history-withdraw = Вывод
history-trade = Трейдинг
history-roulette = Рулетка
history-bonus = Бонус
history-pending = В обработке
history-completed = Завершено

# Статусы пользователя
status-novice = Новичок
status-participant = Участник
status-investor = Инвестор
status-partner = Партнер
`);

const enResource = new FluentResource(`
# General
app-title = Trading Platform
loading = Loading...
error = Error
success = Success
cancel = Cancel
confirm = Confirm
back = Back

# Registration
registration-title = Registration
registration-fullname = Full Name
registration-age = Age
registration-city = City
registration-phone = Phone
registration-iban = IBAN Account Number
registration-button = Register
registration-loading = Registering...
registration-error-fields = Please fill in all fields
registration-error-telegram = Error: failed to get user data

# Main page
main-balance = WALLET BALANCE
main-daily-dynamics = Daily dynamics
main-trading = Trading
main-roulette = Roulette
main-bonuses = Bonuses
main-withdraw = Withdraw
main-manager = Manager
main-history = History

# Navigation
nav-withdraw = Withdraw
nav-manager = Manager
nav-history = History

# Trading
trading-title = BaseCoin
trading-bet-size = Bet size
trading-attempts = { $current }/{ $max } attempts
trading-min-bet = Min: { $amount }
trading-max-bet = Max: { $amount }
trading-up = Up
trading-down = Down
trading-processing = Processing...
trading-error-user = User not found
trading-error-config = Trading configuration not loaded
trading-error-limit = Daily bet limit reached: { $max }
trading-error-max-bet = Maximum bet: { $amount } ({ $percent }% of balance)
trading-error-insufficient = Insufficient funds
trading-success = Bet accepted!
trading-error-execution = Error executing bet

# Roulette
roulette-title = Roulette
roulette-red = Red
roulette-black = Black
roulette-green = Green
roulette-spinning = Spinning...
roulette-bet-size = Bet size
roulette-attempts = { $current }/{ $max } attempts
roulette-min-bet = Min: { $amount }
roulette-max-bet = Max: { $amount }
roulette-error-user = User not found
roulette-error-config = Roulette configuration not loaded
roulette-error-limit = Daily bet limit reached: { $max }
roulette-error-max-bet = Maximum bet: { $amount } ({ $percent }% of balance)
roulette-error-insufficient = Insufficient funds
roulette-success = Bet accepted!
roulette-error-execution = Error executing bet

# Result modals
result-win-title = Win!
result-lose-title = Loss
result-win-amount = You won { $amount }€
result-lose-amount = You lost { $amount }€
result-time-remaining = Time remaining: { $time }
result-continue = Continue

# Withdrawal
withdraw-title = Withdraw funds
withdraw-available = Available for withdrawal: { $amount }€
withdraw-confirm = Do you want to withdraw the full amount?
withdraw-no = No
withdraw-yes = Yes
withdraw-processing = Processing...
withdraw-success = Withdrawal in progress, contact manager for details

# Bonuses
bonuses-title = Bonuses
bonuses-available = Available bonuses
bonuses-claimed = Claimed bonuses

# Manager
manager-title = Manager
manager-contact = Contact manager
manager-telegram = Write to Telegram

# History
history-title = Transaction History
history-deposit = Deposit
history-withdraw = Withdrawal
history-trade = Trading
history-roulette = Roulette
history-bonus = Bonus
history-pending = Pending
history-completed = Completed

# User statuses
status-novice = Novice
status-participant = Participant
status-investor = Investor
status-partner = Partner
`);

// Создаем бандлы
const ruBundle = new FluentBundle('ru', { useIsolating: false });
const enBundle = new FluentBundle('en', { useIsolating: false });

// Добавляем ресурсы
ruBundle.addResource(ruResource);
enBundle.addResource(enResource);

// Определяем тип для локализации
export type Locale = 'ru' | 'en';

// Класс для управления локализацией
class I18nManager {
  private currentLocale: Locale = 'ru';
  private bundles = {
    ru: ruBundle,
    en: enBundle
  };

  // Получить текущую локаль
  getLocale(): Locale {
    return this.currentLocale;
  }

  // Установить локаль
  setLocale(locale: Locale): void {
    this.currentLocale = locale;
    localStorage.setItem('locale', locale);
  }

  // Инициализация (загружаем сохраненную локаль)
  init(): void {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ru', 'en'].includes(savedLocale)) {
      this.currentLocale = savedLocale;
    } else {
      // Определяем локаль по языку браузера
      const browserLang = navigator.language.split('-')[0];
      this.currentLocale = browserLang === 'en' ? 'en' : 'ru';
    }
  }

  // Перевести строку
  t(id: string, args?: Record<string, any>): string {
    const bundle = this.bundles[this.currentLocale];
    const message = bundle.getMessage(id);
    
    if (!message || !message.value) {
      console.warn(`Translation not found for key: ${id}`);
      return id;
    }

    const errors: Error[] = [];
    const result = bundle.formatPattern(message.value, args, errors);
    
    if (errors.length > 0) {
      console.warn(`Translation errors for key ${id}:`, errors);
    }

    return result;
  }

  // Переключить локаль
  toggleLocale(): void {
    this.currentLocale = this.currentLocale === 'ru' ? 'en' : 'ru';
    this.setLocale(this.currentLocale);
  }
}

// Создаем глобальный экземпляр
export const i18n = new I18nManager();

// Инициализируем при загрузке
if (typeof window !== 'undefined') {
  i18n.init();
}

// Хук для использования в компонентах
export const useTranslation = () => {
  return {
    t: i18n.t.bind(i18n),
    locale: i18n.getLocale(),
    setLocale: i18n.setLocale.bind(i18n),
    toggleLocale: i18n.toggleLocale.bind(i18n)
  };
}; 