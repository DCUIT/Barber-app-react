import { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { bookingsApi } from '../../api/bookings';
import { barbersApi } from '../../api/barbers';
import { authApi } from '../../api/auth';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

export default function AdminDashboardScreen() {
  const nav = useNavigation<any>();
  const [stats, setStats] = useState({ totalBookings: 0, totalBarbers: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        const [bRes, baRes, uRes] = await Promise.all([bookingsApi.getAll(), barbersApi.getAll(), authApi.getUsers()]);
        if (!mountedRef.current) return;
        setStats({ totalBookings: bRes.data.totalCount || bRes.data.bookings?.length || 0, totalBarbers: baRes.data?.length || 0, totalUsers: uRes.data?.length || 0 });
      } catch {} finally { if (mountedRef.current) setLoading(false); }
    })();
    return () => { mountedRef.current = false; };
  }, []);

  if (loading) return <Loading fullScreen />;

  const items = [
    { label: 'Quản lý Booking', screen: 'AdminBookings', icon: '📋' },
    { label: 'Quản lý Dịch vụ', screen: 'AdminServices', icon: '💈' },
    { label: 'Quản lý Barber', screen: 'AdminBarbers', icon: '✂️' },
    { label: 'Quản lý Người dùng', screen: 'AdminUsers', icon: '👥' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 24, marginBottom: 24 }}>Admin Dashboard</Text>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>Tổng Bookings</Text>
          <Text style={{ color: '#c5a059', fontSize: 24, fontWeight: 'bold' }}>{stats.totalBookings}</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>Barber</Text>
          <Text style={{ color: '#10b981', fontSize: 24, fontWeight: 'bold' }}>{stats.totalBarbers}</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>Người dùng</Text>
          <Text style={{ color: '#3b82f6', fontSize: 24, fontWeight: 'bold' }}>{stats.totalUsers}</Text>
        </Card>
      </View>
      {items.map((item) => (
        <TouchableOpacity key={item.screen} onPress={() => nav.navigate(item.screen)}
          style={{ backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#374151', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 28, marginRight: 16 }}>{item.icon}</Text>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, flex: 1 }}>{item.label}</Text>
          <Text style={{ color: '#6b7280', fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
