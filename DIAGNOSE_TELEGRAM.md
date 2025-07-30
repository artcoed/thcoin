# Диагностика проблем с Telegram WebApp

## Проблема
Приложение не определяет Telegram WebApp, хотя запускается через Telegram.

## Диагностическая система

### 1. Автоматическая диагностика

При каждом вызове `isTelegramWebApp()` автоматически запускается диагностика, которая выводит в консоль:

```
=== TELEGRAM WEBAPP DIAGNOSIS ===
Full URL: https://your-domain.com/?tgWebAppData=...
Hostname: your-domain.com
Port: 443
Pathname: /
Search: ?tgWebAppData=...
Hash: 
All URL parameters:
  tgWebAppData: query_id=...&user=...&auth_date=...&hash=...
  tgWebAppVersion: 9.0
  tgWebAppPlatform: tdesktop
  tgWebAppThemeParams: {"bg_color":"#17212b",...}
Telegram-specific parameters:
  tgWebAppData: query_id=...&user=...&auth_date=...&hash=...
  tgWebAppVersion: 9.0
  tgWebAppPlatform: tdesktop
  tgWebAppThemeParams: {"bg_color":"#17212b",...}
window.Telegram object: [object Object]
window.Telegram.WebApp: [object Object]
WebApp.initData: query_id=...&user=...&auth_date=...&hash=...
WebApp.initDataUnsafe: [object Object]
WebApp.version: 9.0
WebApp.platform: tdesktop
User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...
Referrer: https://t.me/your_bot
=== END DIAGNOSIS ===
```

### 2. Что проверяется

#### URL параметры
- `tgWebAppData` - основные данные Telegram WebApp
- `tgWebAppVersion` - версия Telegram WebApp
- `tgWebAppPlatform` - платформа (android, ios, tdesktop, macos, weba)
- `tgWebAppThemeParams` - параметры темы

#### Объект window.Telegram
- Наличие объекта `window.Telegram`
- Наличие объекта `window.Telegram.WebApp`
- Доступность `initData` и `initDataUnsafe`

#### User Agent и Referrer
- User Agent содержит "TelegramWebApp"
- Referrer содержит "t.me"

### 3. Возможные причины проблем

#### 1. Неправильная настройка бота
```
Проблема: Бот не настроен для WebApp
Решение: В @BotFather настройте WebApp URL
```

#### 2. Неправильный URL
```
Проблема: URL не соответствует настройкам бота
Решение: Проверьте URL в настройках бота
```

#### 3. Проблемы с HTTPS
```
Проблема: Приложение работает по HTTP
Решение: Используйте HTTPS для production
```

#### 4. Проблемы с доменом
```
Проблема: Домен не добавлен в настройки бота
Решение: Добавьте домен в @BotFather
```

### 4. Пошаговая диагностика

#### Шаг 1: Проверьте настройки бота
1. Откройте @BotFather
2. Выберите вашего бота
3. Нажмите "Bot Settings" → "Web App"
4. Проверьте URL и домен

#### Шаг 2: Проверьте URL в браузере
1. Откройте консоль разработчика
2. Найдите секцию "TELEGRAM WEBAPP DIAGNOSIS"
3. Проверьте наличие параметров `tgWebAppData`, `tgWebAppVersion`

#### Шаг 3: Проверьте объект window.Telegram
```javascript
// В консоли браузера
console.log('Telegram object:', window.Telegram);
console.log('WebApp object:', window.Telegram?.WebApp);
console.log('InitData:', window.Telegram?.WebApp?.initData);
```

#### Шаг 4: Проверьте User Agent
```javascript
// В консоли браузера
console.log('User Agent:', navigator.userAgent);
console.log('Contains TelegramWebApp:', navigator.userAgent.includes('TelegramWebApp'));
```

### 5. Решения для разных случаев

#### Случай 1: Нет параметров в URL
```
Проблема: URL не содержит tgWebAppData
Решение: Проверьте настройки бота в @BotFather
```

#### Случай 2: Есть параметры, но нет объекта Telegram
```
Проблема: window.Telegram не определен
Решение: Проверьте, что скрипт Telegram загружен
```

#### Случай 3: Объект есть, но данные пустые
```
Проблема: initData пустой
Решение: Проверьте подпись данных в боте
```

### 6. Тестирование в разных окружениях

#### Development
```bash
# Локальное тестирование
http://localhost:5173/?debug=true&test_user_id=123456789
```

#### Production
```bash
# Реальное тестирование через бота
https://your-domain.com/
```

### 7. Отладочные команды

#### В консоли браузера
```javascript
// Запустить диагностику вручную
telegramUtils.diagnoseUrl();

// Проверить статус
console.log('Is Telegram:', telegramUtils.isTelegramWebApp());

// Получить данные пользователя
console.log('User:', telegramUtils.getUser());

// Получить полную отладочную информацию
console.log('Debug Info:', telegramUtils.getDebugInfo());
```

### 8. Частые проблемы и решения

#### Проблема: "Is Telegram WebApp: false"
**Возможные причины:**
1. Приложение запущено не через бота
2. Неправильные настройки бота
3. Проблемы с HTTPS

**Решение:**
1. Проверьте настройки в @BotFather
2. Убедитесь, что используете HTTPS
3. Проверьте URL в настройках бота

#### Проблема: "No Telegram user data found"
**Возможные причины:**
1. Пользователь не авторизован
2. Проблемы с парсингом данных
3. Неправильная структура данных

**Решение:**
1. Проверьте структуру `tgWebAppData`
2. Убедитесь, что пользователь авторизован
3. Проверьте логику парсинга

### 9. Контакты для поддержки

Если проблема не решается:
1. Соберите диагностическую информацию из консоли
2. Проверьте настройки бота в @BotFather
3. Убедитесь, что используете правильный URL
4. Проверьте, что домен добавлен в настройки бота 