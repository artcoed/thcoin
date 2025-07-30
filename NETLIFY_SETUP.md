# Настройка Netlify для работы с бекендом

## Проблема
Приложение на Netlify пытается обратиться к `http://localhost:3000`, что вызывает CORS ошибку в production среде.

## Решение

### 1. Настройка переменных окружения в Netlify

1. Войдите в панель управления Netlify
2. Выберите ваш проект
3. Перейдите в **Site settings** → **Environment variables**
4. Добавьте следующие переменные:

```
VITE_API_URL=https://your-backend-domain.com
VITE_BOT_ID=1
```

Замените `https://your-backend-domain.com` на реальный URL вашего бекенда.

### 2. Варианты бекенда

#### Вариант A: Если бекенд развернут на том же домене
```
VITE_API_URL=https://your-app.netlify.app
```

#### Вариант B: Если бекенд на отдельном сервере
```
VITE_API_URL=https://api.your-domain.com
```

#### Вариант C: Если бекенд на Heroku/Railway/Vercel
```
VITE_API_URL=https://your-backend-app.herokuapp.com
```

### 3. Проверка настроек

После настройки переменных окружения:

1. Перезапустите деплой в Netlify
2. Откройте консоль браузера в Telegram WebApp
3. Проверьте, что запросы идут на правильный URL

### 4. Альтернативное решение (временное)

Если бекенд еще не развернут, можно временно отключить запросы к бекенду:

```typescript
// В src/lib/api.ts измените:
const API_URL = import.meta.env.VITE_API_URL || 'https://dummy-api.com';
```

### 5. Проверка CORS на бекенде

Убедитесь, что ваш бекенд настроен для принятия запросов с домена Netlify:

```javascript
// В Express приложении
app.use(cors({
  origin: ['https://your-app.netlify.app', 'https://your-app.netlify.app'],
  credentials: true
}));
```

## После настройки

После правильной настройки переменных окружения:

1. Приложение будет обращаться к правильному URL бекенда
2. CORS ошибки исчезнут
3. Telegram WebApp будет корректно работать с бекендом 