import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, httpLink, splitLink } from '@trpc/client';
import { queryClient } from './react-query';

// Временный тип для роутера (будет заменен на реальный из бекенда)
type AppRouter = any;

// Создаем tRPC React хук
export const trpc = createTRPCReact<AppRouter>();

// URL для API (будет настроен через переменные окружения)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
//
// // Создаем tRPC клиент
// export const trpcClient = trpc.createClient({
//   links: [
//     splitLink({
//       condition: (op) => op.type === 'subscription',
//       true: httpBatchLink({ url: `${API_URL}/trpc` }),
//       false: httpLink({ url: `${API_URL}/trpc` }),
//     }),
//   ],
// });
//
// // Создаем провайдер для tRPC
// export const TRPCProvider = trpc.Provider;