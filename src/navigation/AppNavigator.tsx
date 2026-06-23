import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import Loading from '../components/ui/Loading';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useAuthStore((s) => s.token);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) return <Loading fullScreen message="Đang tải..." />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? <Stack.Screen name="Main" component={MainTabNavigator} /> : <Stack.Screen name="Auth" component={AuthNavigator} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
