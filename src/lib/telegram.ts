// Типы для Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: {
            id: number;
            is_bot: boolean;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            added_to_attachment_menu?: boolean;
            allows_write_to_pm?: boolean;
            photo_url?: string;
          };
          receiver?: {
            id: number;
            is_bot: boolean;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            added_to_attachment_menu?: boolean;
            allows_write_to_pm?: boolean;
            photo_url?: string;
          };
          chat?: {
            id: number;
            type: string;
            title?: string;
            username?: string;
            photo_url?: string;
          };
          chat_type?: string;
          chat_instance?: string;
          start_param?: string;
          can_send_after?: number;
          auth_date: number;
          hash: string;
        };
        version: string;
        platform: string;
        colorScheme: string;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        backButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        mainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isProgressVisible: boolean;
          isActive: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setText: (text: string) => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_visible?: boolean;
            is_progress_visible?: boolean;
            is_active?: boolean;
          }) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        isVersionAtLeast: (version: string) => boolean;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        onEvent: (eventType: string, eventHandler: () => void) => void;
        offEvent: (eventType: string, eventHandler: () => void) => void;
        sendData: (data: string) => void;
        switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback?: (buttonId: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params: {
          text?: string;
        }, callback?: (data: string) => void) => void;
        closeScanQrPopup: () => void;
        readTextFromClipboard: (callback?: (data: string) => void) => void;
        requestWriteAccess: (callback?: (access: boolean) => void) => void;
        requestContact: (callback?: (contact: boolean) => void) => void;
        invokeCustomMethod: (method: string, params: any, callback?: (result: any) => void) => void;
        invokeCustomMethodUnsafe: (method: string, params: any, callback?: (result: any) => void) => void;
        getCustomMethod: (method: string, callback?: (result: any) => void) => void;
        getCustomMethodUnsafe: (method: string, callback?: (result: any) => void) => void;
        setCustomMethod: (method: string, callback?: (result: any) => void) => void;
        setCustomMethodUnsafe: (method: string, callback?: (result: any) => void) => void;
        deleteCustomMethod: (method: string, callback?: (result: any) => void) => void;
        deleteCustomMethodUnsafe: (method: string, callback?: (result: any) => void) => void;
      };
    };
  }
}

// Утилиты для работы с Telegram WebApp
export const telegramUtils = {
  // Проверяем, запущено ли приложение в Telegram
  isTelegramWebApp(): boolean {
    const isTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp;
    console.log('Is Telegram WebApp:', isTelegram);
    return isTelegram;
  },

  // Получаем данные пользователя из Telegram
  getUser(): { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } | null {
    if (!this.isTelegramWebApp()) {
      console.log('Not in Telegram WebApp');
      return null;
    }
    
    const user = window.Telegram!.WebApp.initDataUnsafe.user;
    console.log('Telegram user data:', user);
    return user || null;
  },

  // Получаем telegramId пользователя
  getTelegramId(): string | null {
    const user = this.getUser();
    const telegramId = user ? user.id.toString() : null;
    console.log('Telegram ID:', telegramId);
    return telegramId;
  },

  // Получаем initData для авторизации
  getInitData(): string {
    if (!this.isTelegramWebApp()) {
      console.log('Cannot get initData: not in Telegram WebApp');
      return '';
    }
    const initData = window.Telegram!.WebApp.initData;
    console.log('InitData available:', !!initData);
    return initData;
  },

  // Получаем детальную информацию о состоянии Telegram WebApp
  getDebugInfo(): {
    isTelegramWebApp: boolean;
    hasUser: boolean;
    hasInitData: boolean;
    userData: any;
    initData: string;
  } {
    const isTelegram = this.isTelegramWebApp();
    const user = isTelegram ? window.Telegram!.WebApp.initDataUnsafe.user : null;
    const initData = isTelegram ? window.Telegram!.WebApp.initData : '';
    
    return {
      isTelegramWebApp: isTelegram,
      hasUser: !!user,
      hasInitData: !!initData,
      userData: user,
      initData: initData
    };
  },

  // Инициализируем WebApp
  initWebApp(): void {
    if (this.isTelegramWebApp()) {
      try {
        window.Telegram!.WebApp.ready();
        window.Telegram!.WebApp.expand();
        console.log('Telegram WebApp initialized successfully');
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
      }
    } else {
      console.log('Cannot initialize: not in Telegram WebApp');
    }
  },

  // Показываем алерт
  showAlert(message: string): void {
    if (this.isTelegramWebApp()) {
      window.Telegram!.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  },

  // Показываем подтверждение
  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isTelegramWebApp()) {
        window.Telegram!.WebApp.showConfirm(message, resolve);
      } else {
        resolve(confirm(message));
      }
    });
  },

  // Закрываем WebApp
  close(): void {
    if (this.isTelegramWebApp()) {
      window.Telegram!.WebApp.close();
    }
  },

  // Отправляем данные в бот
  sendData(data: string): void {
    if (this.isTelegramWebApp()) {
      window.Telegram!.WebApp.sendData(data);
    }
  }
}; 