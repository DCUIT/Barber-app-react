import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { bookingsApi } from '../../api/bookings';
import BookingCard from '../../components/BookingCard';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import type { Booking } from '../../types/models';

export default function BookingHistoryScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    try {
      const res = await bookingsApi.getAll();
      setBookings(res.data.bookings || []);
      setError('');
    } catch (err: any) { setError(err?.response?.data?.msg || 'Không thể tải lịch sử'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  const onRefresh = () => { setRefreshing(true); fetch(); };

  if (loading) return <Loading fullScreen />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;
  if (bookings.length === 0) return <EmptyState title="Chưa có lịch đặt" message="Bạn chưa đặt lịch cắt tóc nào. Hãy đặt lịch ngay!" />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c5a059" />} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 16 }}>Tất cả lịch hẹn ({bookings.length})</Text>
      {bookings.map((b) => <BookingCard key={b._id} booking={b} />)}
    </ScrollView>
  );
}
