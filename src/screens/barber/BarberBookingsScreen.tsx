import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TextInput, RefreshControl } from 'react-native';
import Toast from 'react-native-toast-message';
import { bookingsApi } from '../../api/bookings';
import BookingCard from '../../components/BookingCard';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { toDateInputString } from '../../utils/format';
import type { Booking } from '../../types/models';

export default function BarberBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [date, setDate] = useState(toDateInputString(new Date()));
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    try { const res = await bookingsApi.getTodayBookings(date); if (mountedRef.current) setBookings(res.data.bookings || []); }
    catch { if (mountedRef.current) setBookings([]); } finally { if (mountedRef.current) { setLoading(false); setRefreshing(false); } }
  }, [date]);

  useEffect(() => { mountedRef.current = true; fetch(); return () => { mountedRef.current = false; }; }, [fetch]);
  const onRefresh = useCallback(() => { setRefreshing(true); fetch(); }, [fetch]);

  const updateStatus = async (id: string, status: string) => {
    try { await bookingsApi.updateStatus(id, status); Toast.show({ type: 'success', text1: 'Đã cập nhật' }); fetch(); }
    catch (err: any) { Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg || 'Cập nhật thất bại' }); }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c5a059" />} contentContainerStyle={{ paddingBottom: 32 }}>
      <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginTop: 16, marginBottom: 16 }}
        placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" value={date} onChangeText={setDate} />
      {bookings.length === 0 ? <Card><Text style={{ color: '#9ca3af', textAlign: 'center' }}>Không có lịch hẹn ngày {date}</Text></Card>
        : bookings.map((b) => <BookingCard key={b._id} booking={b} showActions onAccept={() => updateStatus(b._id, 'Accepted')} onComplete={() => updateStatus(b._id, 'Completed')} onCancel={() => updateStatus(b._id, 'Cancelled')} />)}
    </ScrollView>
  );
}
