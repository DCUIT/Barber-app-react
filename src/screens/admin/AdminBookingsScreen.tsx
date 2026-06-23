import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import Toast from 'react-native-toast-message';
import { bookingsApi } from '../../api/bookings';
import BookingCard from '../../components/BookingCard';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import type { Booking } from '../../types/models';

export default function AdminBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    try { const res = await bookingsApi.getAll(); if (!mountedRef.current) return; setBookings(res.data.bookings || []); setError(''); }
    catch (err: any) { if (mountedRef.current) setError(err?.response?.data?.msg || 'Không thể tải bookings'); }
    finally { if (mountedRef.current) { setLoading(false); setRefreshing(false); } }
  }, []);

  useEffect(() => { mountedRef.current = true; fetch(); return () => { mountedRef.current = false; }; }, [fetch]);
  const onRefresh = useCallback(() => { setRefreshing(true); fetch(); }, [fetch]);

  const updateStatus = async (id: string, status: string) => {
    try { await bookingsApi.updateStatus(id, status); Toast.show({ type: 'success', text1: 'Đã cập nhật' }); fetch(); }
    catch (err: any) { Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg }); }
  };

  if (loading) return <Loading fullScreen />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;
  if (bookings.length === 0) return <EmptyState title="Chưa có booking nào" />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c5a059" />} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 16 }}>Tất cả bookings ({bookings.length})</Text>
      {bookings.map((b) => <BookingCard key={b._id} booking={b} showActions onAccept={() => updateStatus(b._id, 'Accepted')} onComplete={() => updateStatus(b._id, 'Completed')} onCancel={() => updateStatus(b._id, 'Cancelled')} />)}
    </ScrollView>
  );
}
