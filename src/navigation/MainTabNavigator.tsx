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

const HomeMain = () => <LazyScreen component={HomeScreen} />;

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeMain} />
    </HomeStack.Navigator>
  );
}

const BookingMain = () => <LazyScreen component={BookingScreen} />;
const BookingConfirm = () => <LazyScreen component={BookingConfirmScreen} />;

const BookingStack = createNativeStackNavigator();
function BookingStackScreen() {
  return (
    <BookingStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <BookingStack.Screen name="BookingMain" options={{ title: 'Đặt lịch' }} component={BookingMain} />
      <BookingStack.Screen name="BookingConfirm" options={{ title: 'Xác nhận' }} component={BookingConfirm} />
    </BookingStack.Navigator>
  );
}

const ProfileMain = () => <LazyScreen component={ProfileScreen} />;
const BookingHistory = () => <LazyScreen component={BookingHistoryScreen} />;
const ChangePassword = () => <LazyScreen component={ChangePasswordScreen} />;

const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <ProfileStack.Screen name="ProfileMain" options={{ title: 'Hồ sơ' }} component={ProfileMain} />
      <ProfileStack.Screen name="BookingHistory" options={{ title: 'Lịch sử' }} component={BookingHistory} />
      <ProfileStack.Screen name="ChangePassword" options={{ title: 'Đổi mật khẩu' }} component={ChangePassword} />
    </ProfileStack.Navigator>
  );
}

const BarberDashboard = () => <LazyScreen component={BarberDashboardScreen} />;
const BarberBookings = () => <LazyScreen component={BarberBookingsScreen} />;

const BarberStack = createNativeStackNavigator();
function BarberStackScreen() {
  return (
    <BarberStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <BarberStack.Screen name="BarberDashboard" options={{ title: 'Dashboard Barber' }} component={BarberDashboard} />
      <BarberStack.Screen name="BarberBookings" options={{ title: 'Quản lý lịch' }} component={BarberBookings} />
    </BarberStack.Navigator>
  );
}

const AdminDashboard = () => <LazyScreen component={AdminDashboardScreen} />;
const AdminBookings = () => <LazyScreen component={AdminBookingsScreen} />;
const AdminServices = () => <LazyScreen component={AdminServicesScreen} />;
const AdminBarbers = () => <LazyScreen component={AdminBarbersScreen} />;
const AdminUsers = () => <LazyScreen component={AdminUsersScreen} />;

const AdminStack = createNativeStackNavigator();
function AdminStackScreen() {
  return (
    <AdminStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <AdminStack.Screen name="AdminDashboard" options={{ title: 'Admin' }} component={AdminDashboard} />
      <AdminStack.Screen name="AdminBookings" options={{ title: 'Quản lý Booking' }} component={AdminBookings} />
      <AdminStack.Screen name="AdminServices" options={{ title: 'Quản lý Dịch vụ' }} component={AdminServices} />
      <AdminStack.Screen name="AdminBarbers" options={{ title: 'Quản lý Barber' }} component={AdminBarbers} />
      <AdminStack.Screen name="AdminUsers" options={{ title: 'Quản lý Người dùng' }} component={AdminUsers} />
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
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: 'Trang chủ', tabBarIcon: ({ focused }) => <TabLabel label="Trang chủ" focused={focused} /> }} />
      <Tab.Screen name="Booking" component={BookingStackScreen} options={{ tabBarLabel: 'Đặt lịch', tabBarIcon: ({ focused }) => <TabLabel label="Đặt lịch" focused={focused} /> }} />
      {(role === 'barber' || role === 'admin') && (
        <Tab.Screen name="Barber" component={BarberStackScreen} options={{ tabBarLabel: 'Dashboard', tabBarIcon: ({ focused }) => <TabLabel label="Dashboard" focused={focused} /> }} />
      )}
      {role === 'admin' && (
        <Tab.Screen name="Admin" component={AdminStackScreen} options={{ tabBarLabel: 'Quản trị', tabBarIcon: ({ focused }) => <TabLabel label="Quản trị" focused={focused} /> }} />
      )}
      <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ tabBarLabel: 'Hồ sơ', tabBarIcon: ({ focused }) => <TabLabel label="Hồ sơ" focused={focused} /> }} />
    </Tab.Navigator>
  );
}
