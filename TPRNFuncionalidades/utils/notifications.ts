import { Alert, Vibration } from 'react-native';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  title?: string;
  duration?: number;
}

const vibrationPatterns = {
  success: [100],
  error: [1000, 500, 1000],
  warning: [200, 100, 200],
  info: [100]
};

export const showNotification = (
  message: string,
  type: NotificationType = 'info',
  options: NotificationOptions = {}
) => {
  // Asegurarse de que la vibración se ejecute primero
  const pattern = vibrationPatterns[type];
  
  // Ejecutar vibración de forma síncrona
  Vibration.cancel();
  setTimeout(() => {
    Vibration.vibrate(pattern);
  }, 100);

  // Mostrar alerta
  Alert.alert(
    options.title || getDefaultTitle(type),
    message,
    [{ 
      text: 'OK',
      onPress: () => {
        Vibration.cancel();
      }
    }],
    {
      onDismiss: () => {
        Vibration.cancel();
      }
    }
  );
};

const getDefaultTitle = (type: NotificationType): string => {
  const titles = {
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información'
  };
  return titles[type];
};

// Helpers específicos para cada tipo de notificación
export const showError = (message: string, title?: string) => 
  showNotification(message, 'error', { title });

export const showSuccess = (message: string, title?: string) => 
  showNotification(message, 'success', { title });

export const showWarning = (message: string, title?: string) => 
  showNotification(message, 'warning', { title });

export const showInfo = (message: string, title?: string) => 
  showNotification(message, 'info', { title }); 