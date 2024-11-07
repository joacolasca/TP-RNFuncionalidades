import { useCallback } from 'react';
import { showError } from '@/utils/notifications';

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    if (error instanceof Error) {
      showError(customMessage || error.message);
    } else if (typeof error === 'string') {
      showError(error);
    } else {
      showError(customMessage || 'Ha ocurrido un error inesperado');
    }
  }, []);

  return handleError;
}; 