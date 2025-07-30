# Тестирование Telegram WebApp

## Проблема
Приложение не определяет Telegram WebApp, потому что запускается не через Telegram, а как обычная веб-страница.

## Решение для тестирования

### 1. Тестовые URL для development

Добавлены специальные параметры для тестирования:

```
# Для development режима
http://localhost:5173/?test_telegram=true&test_user_id=123456789&test_user_name=Test%20User

# Принудительный режим (работает в любом окружении)
http://localhost:5173/?force_telegram=true&test_user_id=123456789&test_user_name=Test%20User

# Отладочный режим (работает в любом окружении)
http://localhost:5173/?debug=true&test_user_id=123456789&test_user_name=Test%20User
```

### 2. Параметры для тестирования

- `test_telegram=true` - включает режим тестирования Telegram WebApp (только в development)
- `force_telegram=true` - принудительно включает режим Telegram WebApp (работает везде)
- `debug=true` - включает отладочный режим и Telegram WebApp (работает везде)
- `test_user_id=123456789` - ID тестового пользователя
- `test_user_name=Test User` - имя тестового пользователя

### 3. Примеры тестовых URL

```bash
# Базовый тест (development только)
http://localhost:5173/?test_telegram=true&test_user_id=123456789&test_user_name=Test%20User

# Принудительный режим (любое окружение)
http://localhost:5173/?force_telegram=true&test_user_id=123456789&test_user_name=Test%20User

# Отладочный режим (любое окружение)
http://localhost:5173/?debug=true&test_user_id=123456789&test_user_name=Test%20User

# Другой пользователь (принудительный режим)
http://localhost:5173/?force_telegram=true&test_user_id=987654321&test_user_name=Another%20User

# Только режим Telegram без пользователя
http://localhost:5173/?force_telegram=true
```

### 4. Определение development режима

Система определяет development режим по следующим критериям:
- `import.meta.env.DEV` - Vite development флаг
- `import.meta.env.MODE === 'development'` - Vite mode
- `process.env.NODE_ENV === 'development'` - Node environment
- `window.location.hostname === 'localhost'` - localhost
- `window.location.hostname === '127.0.0.1'` - localhost IP
- `window.location.hostname.includes('localhost')` - любой localhost
- `window.location.hostname.includes('127.0.0.1')` - любой localhost IP

### 5. Что происходит при тестировании

1. **Определение Telegram WebApp**: `isTelegramWebApp()` возвращает `true`
2. **Данные пользователя**: `getUser()` возвращает тестовые данные
3. **InitData**: `getInitData()` возвращает тестовую строку
4. **Регистрация**: Можно протестировать процесс регистрации

### 6. Отладочная панель

Отладочная панель отображается в следующих случаях:
- В development режиме
- При наличии параметра `debug=true` в URL

Панель показывает:
- Статус Telegram WebApp
- Данные пользователя
- Ссылки для быстрого тестирования
- Кнопку обновления информации

### 7. Проверка в консоли

При использовании тестовых URL в консоли должно появиться:
```
Is Telegram WebApp: true {hasTelegramObject: false, hasTelegramParams: false, hasTestParam: true, hasForceTest: false, hasDebugMode: false, isDevelopment: true, hostname: 'localhost', port: '5173', search: '?test_telegram=true&test_user_id=123456789&test_user_name=Test%20User', importMetaEnv: {DEV: true, MODE: 'development', NODE_ENV: 'development'}}
Test user data: {id: 123456789, first_name: "Test User", username: "test_user", photo_url: "https://t.me/i/userpic/320/test.jpg"}
Telegram ID: 123456789
```

### 8. Реальное тестирование в Telegram

Для реального тестирования в Telegram WebApp:

1. Создайте бота в @BotFather
2. Настройте WebApp URL в боте
3. Запустите приложение через бота
4. Проверьте, что параметры `tgWebAppData` и `tgWebAppVersion` присутствуют в URL

### 9. Отключение тестового режима

В production режиме тестовые параметры игнорируются, и приложение работает только с реальными данными Telegram.

### 10. Режимы тестирования

1. **Development тест**: `test_telegram=true` - работает только в development
2. **Принудительный тест**: `force_telegram=true` - работает в любом окружении
3. **Отладочный тест**: `debug=true` - работает в любом окружении + показывает отладочную панель

## Структура тестовых данных

```typescript
{
  id: number,           // ID пользователя
  first_name: string,   // Имя пользователя
  username?: string,    // Username (опционально)
  photo_url?: string    // URL аватара (опционально)
}
```

## Режимы работы

1. **Реальный Telegram WebApp**: `window.Telegram.WebApp` доступен
2. **URL параметры**: `tgWebAppData` и `tgWebAppVersion` в URL
3. **Development тест**: `test_telegram=true` в development режиме
4. **Принудительный тест**: `force_telegram=true` в любом режиме
5. **Отладочный тест**: `debug=true` в любом режиме + отладочная панель 