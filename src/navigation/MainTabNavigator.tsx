import { lazy, Suspense, memo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { useAuthStore } from '../store/authStore';
import Loading from '../components/ui/Loading';

const HomeScreen = lazy(() => import('../screens/home/HomeScreen'));
const BookingScreen = lazy(() => import('../screens/booking/BookingScreen'));
const BookingConfirmScreen = lazy(() => import('../screens/booking/BookingConfirmScreen'));
const ProfileScreen = lazy(() => import('../screens/profile/ProfileScreen'));
const BookingHistoryScreen = lazy(() => import('../screens/profile/BookingHistoryScreen'));
const ChangePasswordScreen = lazy(() => import('../screens/profile/ChangePasswordScreen'));
const BarberDashboardScreen = lazy(() => import('../screens/barber/BarberDashboardScreen'));
const BarberBookingsScreen = lazy(() => import('../screens/barber/BarberBookingsScreen'));
const AdminDashboardScreen = lazy(() => import('../screens/admin/AdminDashboardScreen'));
const AdminBookingsScreen = lazy(() => import('../screens/admin/AdminBookingsScreen'));
const AdminServicesScreen = lazy(() => import('../screens/admin/AdminServicesScreen'));
const AdminBarbersScreen = lazy(() => import('../screens/admin/AdminBarbersScreen'));
const AdminUsersScreen = lazy(() => import('../screens/admin/AdminUsersScreen'));

const ICONS: Record<string, string> = { 'Trang chủ': '🏠', 'Đặt lịch': '📅', 'Hồ sơ': '👤', 'Dashboard': '📊', 'Quản trị': '⚙️' };

const TabLabel = memo(function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{ICONS[label] || '📌'}</Text>
    </View>
  );
});

function LazyScreen({ component: Component }: { component: React.ComponentType }) {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <Component />
    </Suspense>
  );
}

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain">{() => <LazyScreen component={HomeScreen} />}</HomeStack.Screen>
    </HomeStack.Navigator>
  );
}

const BookingStack = createNativeStackNavigator();
function BookingStackScreen() {
  return (
    <BookingStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <BookingStack.Screen name="BookingMain" options={{ title: 'Đặt lịch' }}>{() => <LazyScreen component={BookingScreen} />}</BookingStack.Screen>
      <BookingStack.Screen name="BookingConfirm" options={{ title: 'Xác nhận' }}>{() => <LazyScreen component={BookingConfirmScreen} />}</BookingStack.Screen>
    </BookingStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <ProfileStack.Screen name="ProfileMain" options={{ title: 'Hồ sơ' }}>{() => <LazyScreen component={ProfileScreen} />}</ProfileStack.Screen>
      <ProfileStack.Screen name="BookingHistory" options={{ title: 'Lịch sử' }}>{() => <LazyScreen component={BookingHistoryScreen} />}</ProfileStack.Screen>
      <ProfileStack.Screen name="ChangePassword" options={{ title: 'Đổi mật khẩu' }}>{() => <LazyScreen component={ChangePasswordScreen} />}</ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
}

const BarberStack = createNativeStackNavigator();
function BarberStackScreen() {
  return (
    <BarberStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <BarberStack.Screen name="BarberDashboard" options={{ title: 'Dashboard Barber' }}>{() => <LazyScreen component={BarberDashboardScreen} />}</BarberStack.Screen>
      <BarberStack.Screen name="BarberBookings" options={{ title: 'Quản lý lịch' }}>{() => <LazyScreen component={BarberBookingsScreen} />}</BarberStack.Screen>
    </BarberStack.Navigator>
  );
}

const AdminStack = createNativeStackNavigator();
function AdminStackScreen() {
  return (
    <AdminStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <AdminStack.Screen name="AdminDashboard" options={{ title: 'Admin' }}>{() => <LazyScreen component={AdminDashboardScreen} />}</AdminStack.Screen>
      <AdminStack.Screen name="AdminBookings" options={{ title: 'Quản lý Booking' }}>{() => <LazyScreen component={AdminBookingsScreen} />}</AdminStack.Screen>
      <AdminStack.Screen name="AdminServices" options={{ title: 'Quản lý Dịch vụ' }}>{() => <LazyScreen component={AdminServicesScreen} />}</AdminStack.Screen>
      <AdminStack.Screen name="AdminBarbers" options={{ title: 'Quản lý Barber' }}>{() => <LazyScreen component={AdminBarbersScreen} />}</AdminStack.Screen>
      <AdminStack.Screen name="AdminUsers" options={{ title: 'Quản lý Người dùng' }}>{() => <LazyScreen component={AdminUsersScreen} />}</AdminStack.Screen>
    </AdminStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || 'user';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0f3460', borderTopColor: '#1a1a2e', height: 60, paddingBottom: 8, paddingTop: 4 },
        tabBarActiveTintColor: '#c5a059',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" options={{ tabBarLabel: 'Trang chủ', tabBarIcon: ({ focused }) => <TabLabel label="Trang chủ" focused={focused} /> }}>
        {() => <HomeStackScreen />}
      </Tab.Screen>
      <Tab.Screen name="Booking" options={{ tabBarLabel: 'Đặt lịch', tabBarIcon: ({ focused }) => <TabLabel label="Đặt lịch" focused={focused} /> }}>
        {() => <BookingStackScreen />}
      </Tab.Screen>
      {(role === 'barber' || role === 'admin') && (
        <Tab.Screen name="Barber" options={{ tabBarLabel: 'Dashboard', tabBarIcon: ({ focused }) => <TabLabel label="Dashboard" focused={focused} /> }}>
          {() => <BarberStackScreen />}
        </Tab.Screen>
      )}
      {role === 'admin' && (
        <Tab.Screen name="Admin" options={{ tabBarLabel: 'Quản trị', tabBarIcon: ({ focused }) => <TabLabel label="Quản trị" focused={focused} /> }}>
          {() => <AdminStackScreen />}
        </Tab.Screen>
      )}
      <Tab.Screen name="Profile" options={{ tabBarLabel: 'Hồ sơ', tabBarIcon: ({ focused }) => <TabLabel label="Hồ sơ" focused={focused} /> }}>
        {() => <ProfileStackScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
