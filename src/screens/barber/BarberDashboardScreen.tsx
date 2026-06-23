import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { bookingsApi } from '../../api/bookings';
import BookingCard from '../../components/BookingCard';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import ErrorState from '../../components/ui/ErrorState';
import { toDateInputString } from '../../utils/format';
import type { Booking } from '../../types/models';

export default function BarberDashboardScreen() {
  const nav = useNavigation<any>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    try {
      const date = toDateInputString(new Date());
      const res = await bookingsApi.getTodayBookings(date);
      setBookings(res.data.bookings || []);
      setError('');
    } catch (err: any) { setError(err?.response?.data?.msg || 'Không thể tải dữ liệu'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  const onRefresh = () => { setRefreshing(true); fetch(); };

  const updateStatus = async (id: string, status: string) => {
    try { await bookingsApi.updateStatus(id, status); Toast.show({ type: 'success', text1: 'Đã cập nhật' }); fetch(); }
    catch (err: any) { Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg || 'Cập nhật thất bại' }); }
  };

  if (loading) return <Loading fullScreen />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;

  const pending = bookings.filter(b => b.status === 'Pending').length;
  const accepted = bookings.filter(b => b.status === 'Accepted').length;
  const completed = bookings.filter(b => b.status === 'Completed').length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c5a059" />} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>Chờ xác nhận</Text>
          <Text style={{ color: '#c5a059', fontSize: 24, fontWeight: 'bold' }}>{pending}</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>Đã xác nhận</Text>
          <Text style={{ color: '#10b981', fontSize: 24, fontWeight: 'bold' }}>{accepted}</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>Hoàn thành</Text>
          <Text style={{ color: '#3b82f6', fontSize: 24, fontWeight: 'bold' }}>{completed}</Text>
        </Card>
      </View>

      {bookings.length === 0 ? (
        <Card><Text style={{ color: '#9ca3af', textAlign: 'center' }}>Không có lịch hẹn hôm nay</Text></Card>
      ) : bookings.map((b) => (
        <BookingCard key={b._id} booking={b} showActions onAccept={() => updateStatus(b._id, 'Accepted')} onComplete={() => updateStatus(b._id, 'Completed')} onCancel={() => updateStatus(b._id, 'Cancelled')} />
      ))}

      <TouchableOpacity onPress={() => nav.navigate('BarberBookings')} style={{ marginTop: 16, backgroundColor: '#16213e', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#374151', alignItems: 'center' }}>
        <Text style={{ color: '#c5a059', fontWeight: 'bold' }}>Quản lý tất cả lịch hẹn →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
