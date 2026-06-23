import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { useAuthStore } from '../store/authStore';

import HomeScreen from '../screens/home/HomeScreen';
import BookingScreen from '../screens/booking/BookingScreen';
import BookingConfirmScreen from '../screens/booking/BookingConfirmScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import BookingHistoryScreen from '../screens/profile/BookingHistoryScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import BarberDashboardScreen from '../screens/barber/BarberDashboardScreen';
import BarberBookingsScreen from '../screens/barber/BarberBookingsScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminBookingsScreen from '../screens/admin/AdminBookingsScreen';
import AdminServicesScreen from '../screens/admin/AdminServicesScreen';
import AdminBarbersScreen from '../screens/admin/AdminBarbersScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = { 'Trang chủ': '🏠', 'Đặt lịch': '📅', 'Hồ sơ': '👤', 'Dashboard': '📊', 'Quản trị': '⚙️' };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[label] || '📌'}</Text>
    </View>
  );
}

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return <HomeStack.Navigator screenOptions={{ headerShown: false }}><HomeStack.Screen name="HomeMain" component={HomeScreen} /></HomeStack.Navigator>;
}

const BookingStack = createNativeStackNavigator();
function BookingStackScreen() {
  return (
    <BookingStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <BookingStack.Screen name="BookingMain" component={BookingScreen} options={{ title: 'Đặt lịch' }} />
      <BookingStack.Screen name="BookingConfirm" component={BookingConfirmScreen} options={{ title: 'Xác nhận' }} />
    </BookingStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Hồ sơ' }} />
      <ProfileStack.Screen name="BookingHistory" component={BookingHistoryScreen} options={{ title: 'Lịch sử' }} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Đổi mật khẩu' }} />
    </ProfileStack.Navigator>
  );
}

const BarberStack = createNativeStackNavigator();
function BarberStackScreen() {
  return (
    <BarberStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <BarberStack.Screen name="BarberDashboard" component={BarberDashboardScreen} options={{ title: 'Dashboard Barber' }} />
      <BarberStack.Screen name="BarberBookings" component={BarberBookingsScreen} options={{ title: 'Quản lý lịch' }} />
    </BarberStack.Navigator>
  );
}

const AdminStack = createNativeStackNavigator();
function AdminStackScreen() {
  return (
    <AdminStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin' }} />
      <AdminStack.Screen name="AdminBookings" component={AdminBookingsScreen} options={{ title: 'Quản lý Booking' }} />
      <AdminStack.Screen name="AdminServices" component={AdminServicesScreen} options={{ title: 'Quản lý Dịch vụ' }} />
      <AdminStack.Screen name="AdminBarbers" component={AdminBarbersScreen} options={{ title: 'Quản lý Barber' }} />
      <AdminStack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Quản lý Người dùng' }} />
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
