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
      const response = await apiClient.getLocale(locale) as {
        success: boolean;
        translations?: Translations;
        errorMessage?: string;
      };
      if (response.success && response.translations) {
        this.translations = response.translations;
      } else {
        console.error('Failed to load translations:', response.errorMessage);
        // Минимальный fallback только для критически важных сообщений
        this.translations = this.getMinimalFallback();
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      // Минимальный fallback только для критически важных сообщений
      this.translations = this.getMinimalFallback();
    } finally {
      this.isLoading = false;
    }
  }

  // Минимальный fallback только для критически важных сообщений
  private getMinimalFallback(): Translations {
    return {
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      'cancel': 'Cancel',
      'confirm': 'Confirm',
      'back': 'Back'
    };
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