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
    // Проверяем наличие объекта Telegram
    const hasTelegramObject = typeof window !== 'undefined' && !!window.Telegram?.WebApp;
    
    // Проверяем наличие параметров Telegram в URL
    const hasTelegramParams = typeof window !== 'undefined' && 
      (window.location.search.includes('tgWebAppData') || 
       window.location.search.includes('tgWebAppVersion'));
    
    // Проверяем development режим несколькими способами
    const isDevelopment = 
      import.meta.env.DEV || 
      import.meta.env.MODE === 'development' ||
      process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1')
      ));
    
    // Проверяем тестовые параметры
    const hasTestParam = typeof window !== 'undefined' && 
      window.location.search.includes('test_telegram=true');
    
    // Проверяем принудительный режим тестирования
    const hasForceTest = typeof window !== 'undefined' && 
      window.location.search.includes('force_telegram=true');
    
    // Проверяем отладочный режим
    const hasDebugMode = typeof window !== 'undefined' && 
      window.location.search.includes('debug=true');
    
    const isTelegram = hasTelegramObject || hasTelegramParams || (isDevelopment && hasTestParam) || hasForceTest || hasDebugMode;
    
    console.log('Is Telegram WebApp:', isTelegram, {
      hasTelegramObject,
      hasTelegramParams,
      hasTestParam,
      hasForceTest,
      hasDebugMode,
      isDevelopment,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      port: typeof window !== 'undefined' ? window.location.port : 'unknown',
      search: typeof window !== 'undefined' ? window.location.search : '',
      importMetaEnv: {
        DEV: import.meta.env.DEV,
        MODE: import.meta.env.MODE,
        NODE_ENV: process.env.NODE_ENV
      }
    });
    
    return isTelegram;
  },

  // Парсим данные пользователя из URL параметров
  parseUserFromUrl(): { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } | null {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    const tgWebAppData = urlParams.get('tgWebAppData');
    
    if (!tgWebAppData) return null;
    
    try {
      // Декодируем данные
      const decodedData = decodeURIComponent(tgWebAppData);
      const params = new URLSearchParams(decodedData);
      const userParam = params.get('user');
      
      if (userParam) {
        const user = JSON.parse(decodeURIComponent(userParam));
        console.log('Parsed user from URL:', user);
        return user;
      }
    } catch (error) {
      console.error('Error parsing user from URL:', error);
    }
    
    return null;
  },

  // Получаем тестовые данные пользователя для development
  getTestUserData(): { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } | null {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    const testUserId = urlParams.get('test_user_id');
    const testUserName = urlParams.get('test_user_name') || 'Test User';
    
    // Работаем в любом режиме, если есть принудительный флаг или отладочный режим
    const isDevelopment = 
      import.meta.env.DEV || 
      import.meta.env.MODE === 'development' ||
      process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1')
      ));
    
    const hasForceTest = urlParams.get('force_telegram') === 'true';
    const hasDebugMode = urlParams.get('debug') === 'true';
    
    if ((isDevelopment || hasForceTest || hasDebugMode) && testUserId) {
      return {
        id: parseInt(testUserId),
        first_name: testUserName,
        username: 'test_user',
        photo_url: 'https://t.me/i/userpic/320/test.jpg'
      };
    }
    
    return null;
  },

  // Получаем данные пользователя из Telegram
  getUser(): { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } | null {
    // Сначала пробуем получить из объекта Telegram
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      console.log('Telegram user data from object:', user);
      return user;
    }
    
    // Если не получилось, пробуем из URL
    const userFromUrl = this.parseUserFromUrl();
    if (userFromUrl) {
      console.log('Telegram user data from URL:', userFromUrl);
      return userFromUrl;
    }
    
    // Пробуем тестовые данные
    const testUser = this.getTestUserData();
    if (testUser) {
      console.log('Test user data:', testUser);
      return testUser;
    }
    
    console.log('No Telegram user data found');
    return null;
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
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
      const initData = window.Telegram.WebApp.initData;
      console.log('InitData available:', !!initData);
      return initData;
    }
    
    // Если нет initData из объекта, пробуем из URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tgWebAppData = urlParams.get('tgWebAppData');
      if (tgWebAppData) {
        console.log('InitData from URL available');
        return decodeURIComponent(tgWebAppData);
      }
    }
    
    // Возвращаем тестовые данные в любом режиме с принудительным флагом
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('force_telegram') === 'true' || 
          urlParams.get('test_telegram') === 'true' ||
          urlParams.get('debug') === 'true') {
        console.log('Using test initData');
        return 'test_init_data_for_development';
      }
    }
    
    console.log('Cannot get initData: not in Telegram WebApp');
    return '';
  },

  // Получаем детальную информацию о состоянии Telegram WebApp
  getDebugInfo(): {
    isTelegramWebApp: boolean;
    hasUser: boolean;
    hasInitData: boolean;
    userData: any;
    initData: string;
    urlParams: string;
    isDevelopment: boolean;
    hasTestParams: boolean;
    hasForceTest: boolean;
    hasDebugMode: boolean;
  } {
    const isTelegram = this.isTelegramWebApp();
    const user = this.getUser();
    const initData = this.getInitData();
    const urlParams = typeof window !== 'undefined' ? window.location.search : '';
    
    const isDevelopment = 
      import.meta.env.DEV || 
      import.meta.env.MODE === 'development' ||
      process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1')
      ));
    
    const hasTestParams = typeof window !== 'undefined' && 
      (window.location.search.includes('test_telegram=true') || 
       window.location.search.includes('test_user_id='));
    
    const hasForceTest = typeof window !== 'undefined' && 
      window.location.search.includes('force_telegram=true');
    
    const hasDebugMode = typeof window !== 'undefined' && 
      window.location.search.includes('debug=true');
    
    return {
      isTelegramWebApp: isTelegram,
      hasUser: !!user,
      hasInitData: !!initData,
      userData: user,
      initData: initData,
      urlParams: urlParams,
      isDevelopment: isDevelopment,
      hasTestParams: hasTestParams,
      hasForceTest: hasForceTest,
      hasDebugMode: hasDebugMode
    };
  },

  // Инициализируем WebApp
  initWebApp(): void {
    if (this.isTelegramWebApp()) {
      try {
        // Если есть объект Telegram, инициализируем его
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();
          console.log('Telegram WebApp initialized successfully');
        } else {
          console.log('Telegram WebApp object not available, but URL parameters detected');
        }
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
      }
    } else {
      console.log('Cannot initialize: not in Telegram WebApp');
    }
  },

  // Показываем алерт
  showAlert(message: string): void {
    if (this.isTelegramWebApp() && window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  },

  // Показываем подтверждение
  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isTelegramWebApp() && window.Telegram?.WebApp) {
        window.Telegram.WebApp.showConfirm(message, resolve);
      } else {
        resolve(confirm(message));
      }
    });
  },

  // Закрываем WebApp
  close(): void {
    if (this.isTelegramWebApp() && window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  },

  // Отправляем данные в бот
  sendData(data: string): void {
    if (this.isTelegramWebApp() && window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(data);
    }
  }
}; 