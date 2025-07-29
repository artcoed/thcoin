import { QueryClient } from "@tanstack/react-query";

// Коды ошибок, которые не нужно повторять
const DONT_RETRY_ERROR_CODES = [401, 402, 403, 404, 500, 501];
const MAX_RETRY_COUNT = 3;

// Тип для tRPC ошибки
interface TrpcError extends Error {
  data?: {
    httpStatus?: number;
  };
}

// Функция для проверки tRPC ошибок
function isTrpcError(error: any): error is TrpcError {
  return error && typeof error === 'object' && 'data' in error;
}

// Кастомизация retry
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(count, error) {
        if (count >= MAX_RETRY_COUNT) return false;

        if (isTrpcError(error)) {
          return !DONT_RETRY_ERROR_CODES.includes(error.data?.httpStatus ?? 0);
        }

        return true;
      },
      // Время жизни кеша
      staleTime: 5 * 60 * 1000, // 5 минут
      // Время жизни в кеше
      gcTime: 10 * 60 * 1000, // 10 минут
    },
    mutations: {
      retry(count, error) {
        if (count >= MAX_RETRY_COUNT) return false;

        if (isTrpcError(error)) {
          return !DONT_RETRY_ERROR_CODES.includes(error.data?.httpStatus ?? 0);
        }

        return true;
      },
    },
  },
}); 