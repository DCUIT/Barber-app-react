import { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, []);

  const toastConfig = {
    success: { text1Style: { fontSize: 14 } },
    error: { text1Style: { fontSize: 14 } },
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}
