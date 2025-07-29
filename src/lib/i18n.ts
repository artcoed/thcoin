import { apiClient } from './api';

// Определяем тип для локализации
export type Locale = 'ru' | 'en';

// Тип для переводов
export type Translations = Record<string, string>;

// Класс для управления локализацией
class I18nManager {
  private currentLocale: Locale = 'ru';
  private translations: Translations = {};
  private isLoading = false;

  // Получить текущую локаль
  getLocale(): Locale {
    return this.currentLocale;
  }

  // Установить локаль
  async setLocale(locale: Locale): Promise<void> {
    this.currentLocale = locale;
    localStorage.setItem('locale', locale);
    await this.loadTranslations(locale);
  }

  // Загрузить переводы с бекенда
  async loadTranslations(locale: Locale): Promise<void> {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      // Временно отключаем загрузку с бекенда из-за CORS
      console.log('Loading translations from fallback due to CORS issues');
      this.translations = this.getFallbackTranslations(locale);
      
      // TODO: Включить обратно после исправления CORS
      /*
      const response = await apiClient.getLocale(locale) as {
        success: boolean;
        translations?: Translations;
        errorMessage?: string;
      };
      if (response.success && response.translations) {
        this.translations = response.translations;
      } else {
        console.error('Failed to load translations:', response.errorMessage);
        this.translations = this.getFallbackTranslations(locale);
      }
      */
    } catch (error) {
      console.error('Error loading translations:', error);
      this.translations = this.getFallbackTranslations(locale);
    } finally {
      this.isLoading = false;
    }
  }

  // Fallback переводы
  private getFallbackTranslations(locale: Locale): Translations {
    if (locale === 'en') {
      return {
        'app-title': 'Trading Platform',
        'loading': 'Loading...',
        'error': 'Error',
        'success': 'Success',
        'cancel': 'Cancel',
        'confirm': 'Confirm',
        'back': 'Back',
        'registration-title': 'Registration',
        'registration-fullname': 'Full Name',
        'registration-age': 'Age',
        'registration-city': 'City',
        'registration-phone': 'Phone',
        'registration-iban': 'IBAN Account Number',
        'registration-button': 'Register',
        'registration-loading': 'Registering...',
        'registration-error-fields': 'Please fill in all fields',
        'registration-error-telegram': 'Error: failed to get user data',
        'main-balance': 'WALLET BALANCE',
        'main-daily-dynamics': 'Daily dynamics',
        'main-trading': 'Trading',
        'main-roulette': 'Roulette',
        'main-bonuses': 'Bonuses',
        'main-withdraw': 'Withdraw',
        'main-manager': 'Manager',
        'main-history': 'History',
        'nav-withdraw': 'Withdraw',
        'nav-manager': 'Manager',
        'nav-history': 'History',
        'trading-title': 'BaseCoin',
        'trading-bet-size': 'Bet size',
        'trading-up': 'Up',
        'trading-down': 'Down',
        'trading-processing': 'Processing...',
        'trading-error-user': 'User not found',
        'trading-error-config': 'Trading configuration not loaded',
        'trading-error-insufficient': 'Insufficient funds',
        'trading-success': 'Bet accepted!',
        'trading-error-execution': 'Error executing bet',
        'roulette-title': 'Roulette',
        'roulette-red': 'Red',
        'roulette-black': 'Black',
        'roulette-green': 'Green',
        'roulette-spinning': 'Spinning...',
        'roulette-bet-size': 'Bet size',
        'roulette-error-user': 'User not found',
        'roulette-error-config': 'Roulette configuration not loaded',
        'roulette-error-insufficient': 'Insufficient funds',
        'roulette-success': 'Bet accepted!',
        'roulette-error-execution': 'Error executing bet',
        'result-win-title': 'Win!',
        'result-lose-title': 'Loss',
        'result-continue': 'Continue',
        'withdraw-title': 'Withdraw funds',
        'withdraw-confirm': 'Do you want to withdraw the full amount?',
        'withdraw-no': 'No',
        'withdraw-yes': 'Yes',
        'withdraw-processing': 'Processing...',
        'withdraw-success': 'Withdrawal in progress, contact manager for details',
        'bonuses-title': 'Bonuses',
        'bonuses-available': 'Available bonuses',
        'bonuses-claimed': 'Claimed bonuses',
        'manager-title': 'Manager',
        'manager-contact': 'Contact manager',
        'manager-telegram': 'Write to Telegram',
        'history-title': 'Transaction History',
        'history-deposit': 'Deposit',
        'history-withdraw': 'Withdrawal',
        'history-trade': 'Trading',
        'history-roulette': 'Roulette',
        'history-bonus': 'Bonus',
        'history-pending': 'Pending',
        'history-completed': 'Completed',
        'status-novice': 'Novice',
        'status-participant': 'Participant',
        'status-investor': 'Investor',
        'status-partner': 'Partner'
      };
    } else {
      return {
        'app-title': 'Торговая платформа',
        'loading': 'Загрузка...',
        'error': 'Ошибка',
        'success': 'Успешно',
        'cancel': 'Отмена',
        'confirm': 'Подтвердить',
        'back': 'Назад',
        'registration-title': 'Регистрация',
        'registration-fullname': 'ФИО',
        'registration-age': 'Возраст',
        'registration-city': 'Город',
        'registration-phone': 'Телефон',
        'registration-iban': 'Номер счета IBAN',
        'registration-button': 'Зарегистрироваться',
        'registration-loading': 'Регистрация...',
        'registration-error-fields': 'Пожалуйста, заполните все поля',
        'registration-error-telegram': 'Ошибка: не удалось получить данные пользователя',
        'main-balance': 'БАЛАНС КОШЕЛЬКА',
        'main-daily-dynamics': 'Динамика за сутки',
        'main-trading': 'Трейдинг',
        'main-roulette': 'Рулетка',
        'main-bonuses': 'Бонусы',
        'main-withdraw': 'Вывод',
        'main-manager': 'Менеджер',
        'main-history': 'История',
        'nav-withdraw': 'Вывод',
        'nav-manager': 'Менеджер',
        'nav-history': 'История',
        'trading-title': 'BaseCoin',
        'trading-bet-size': 'Размер ставки',
        'trading-up': 'Вверх',
        'trading-down': 'Вниз',
        'trading-processing': 'Обработка...',
        'trading-error-user': 'Пользователь не найден',
        'trading-error-config': 'Конфигурация трейдинга не загружена',
        'trading-error-insufficient': 'Недостаточно средств',
        'trading-success': 'Ставка принята!',
        'trading-error-execution': 'Ошибка при выполнении ставки',
        'roulette-title': 'Рулетка',
        'roulette-red': 'Красное',
        'roulette-black': 'Черное',
        'roulette-green': 'Зеленое',
        'roulette-spinning': 'Крутится...',
        'roulette-bet-size': 'Размер ставки',
        'roulette-error-user': 'Пользователь не найден',
        'roulette-error-config': 'Конфигурация рулетки не загружена',
        'roulette-error-insufficient': 'Недостаточно средств',
        'roulette-success': 'Ставка принята!',
        'roulette-error-execution': 'Ошибка при выполнении ставки',
        'result-win-title': 'Победа!',
        'result-lose-title': 'Проигрыш',
        'result-continue': 'Продолжить',
        'withdraw-title': 'Вывод средств',
        'withdraw-confirm': 'Вы хотите вывести всю сумму?',
        'withdraw-no': 'Нет',
        'withdraw-yes': 'Да',
        'withdraw-processing': 'Обработка...',
        'withdraw-success': 'Вывод в обработке, подробности уточните у менеджера',
        'bonuses-title': 'Бонусы',
        'bonuses-available': 'Доступные бонусы',
        'bonuses-claimed': 'Полученные бонусы',
        'manager-title': 'Менеджер',
        'manager-contact': 'Связаться с менеджером',
        'manager-telegram': 'Написать в Telegram',
        'history-title': 'История операций',
        'history-deposit': 'Депозит',
        'history-withdraw': 'Вывод',
        'history-trade': 'Трейдинг',
        'history-roulette': 'Рулетка',
        'history-bonus': 'Бонус',
        'history-pending': 'В обработке',
        'history-completed': 'Завершено',
        'status-novice': 'Новичок',
        'status-participant': 'Участник',
        'status-investor': 'Инвестор',
        'status-partner': 'Партнер'
      };
    }
  }

  // Инициализация (загружаем сохраненную локаль)
  async init(): Promise<void> {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ru', 'en'].includes(savedLocale)) {
      this.currentLocale = savedLocale;
    } else {
      // Определяем локаль по языку браузера
      const browserLang = navigator.language.split('-')[0];
      this.currentLocale = browserLang === 'en' ? 'en' : 'ru';
    }
    
    // Загружаем переводы
    await this.loadTranslations(this.currentLocale);
  }

  // Перевести строку
  t(id: string, args?: Record<string, any>): string {
    const translation = this.translations[id];
    
    if (!translation) {
      console.warn(`Translation not found for key: ${id}`);
      return id;
    }

    // Если есть параметры для подстановки
    if (args) {
      let result = translation;
      Object.entries(args).forEach(([key, value]) => {
        const placeholder = `{ $${key} }`;
        result = result.replace(placeholder, String(value));
      });
      return result;
    }

    return translation;
  }

  // Переключить локаль
  async toggleLocale(): Promise<void> {
    const newLocale = this.currentLocale === 'ru' ? 'en' : 'ru';
    await this.setLocale(newLocale);
  }

  // Получить все переводы
  getTranslations(): Translations {
    return { ...this.translations };
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
    toggleLocale: i18n.toggleLocale.bind(i18n),
    translations: i18n.getTranslations()
  };
}; 