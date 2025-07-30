# Исправление CORS проблемы

## Проблема
```
Access to fetch at 'http://localhost:3000/trpc/getLocale' from origin 'https://polite-brigadeiros-f94dbe.netlify.app' has been blocked by CORS policy
```

## Причина
Приложение на Netlify пытается обратиться к `http://localhost:3000`, но бекенд не доступен по этому адресу из production среды.

## Решение

### 1. Настройка переменных окружения в Netlify

**ВАЖНО**: Сначала настройте правильный URL бекенда в Netlify:

1. Войдите в панель управления Netlify
2. Выберите ваш проект
3. Перейдите в **Site settings** → **Environment variables**
4. Добавьте переменную:
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

Замените `https://your-backend-domain.com` на реальный URL вашего бекенда.

### 2. Настройка CORS на бекенде

Добавьте CORS middleware в ваш Express сервер:

```typescript
// project/src/server.ts
import cors from 'cors';

// Добавьте перед настройкой tRPC
app.use(cors({
  origin: [
    'https://polite-brigadeiros-f94dbe.netlify.app',
    'https://*.netlify.app', // любой домен Netlify
    'http://localhost:5173', // для разработки
    'http://localhost:3000'  // для разработки
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-telegram-auth', 'x-bot-id']
}));
```

### 2. Установка cors пакета

```bash
cd project
npm install cors
npm install @types/cors --save-dev
```

### 3. Альтернативное решение - настройка nginx

Если используете nginx, добавьте в конфигурацию:

```nginx
# nginx/nginx.conf
location /trpc/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,x-telegram-auth,x-bot-id' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
    
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,x-telegram-auth,x-bot-id';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
}
```

### 4. Включение локализации с бекенда

После исправления CORS раскомментируйте код в `my-app5/src/lib/i18n.ts`:

```typescript
// Удалите комментарии вокруг этого кода:
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
```

### 5. Проверка

После исправления CORS:
1. Перезапустите бекенд
2. Обновите страницу в Telegram WebApp
3. Проверьте консоль - не должно быть CORS ошибок
4. Переводы должны загружаться с бекенда

## Временное решение

Пока CORS не исправлен, приложение использует fallback переводы, что позволяет ему работать, но без динамической локализации с бекенда. 