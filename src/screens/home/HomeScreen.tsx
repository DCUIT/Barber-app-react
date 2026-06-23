import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { servicesApi } from '../../api/services';
import { barbersApi } from '../../api/barbers';
import { reviewsApi } from '../../api/reviews';
import { useAuthStore, selectUser } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import BarberCard from '../../components/BarberCard';
import ReviewItem from '../../components/ReviewItem';
import { formatPrice } from '../../utils/format';
import type { Service, Barber, Review } from '../../types/models';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1500&q=80';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const user = useAuthStore(selectUser);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const [svcRes, barRes] = await Promise.all([servicesApi.getAll(), barbersApi.getAll()]);
      if (!mountedRef.current) return;
      setServices(svcRes.data || []);
      setBarbers(barRes.data || []);
      const reviewMap: Record<string, Review[]> = {};
      await Promise.all((barRes.data || []).slice(0, 3).map(async (b) => {
        try { const r = await reviewsApi.getByBarber(b._id); if (mountedRef.current) reviewMap[b._id] = r.data || []; } catch {}
      }));
      if (mountedRef.current) setReviews(reviewMap);
    } catch {} finally { if (mountedRef.current) { setLoading(false); setRefreshing(false); } }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading fullScreen message="Đang tải..." />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c5a059" />}>
      <ImageBackground source={{ uri: HERO_IMAGE }} style={{ height: 280, justifyContent: 'center', paddingHorizontal: 24 }} imageStyle={{ opacity: 0.4 }}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View>
          <Text style={{ color: '#c5a059', fontSize: 34, fontWeight: '900', lineHeight: 38 }}>THE CUTTING{'\n'}EDGE BARBER</Text>
          <Text style={{ color: '#fff', fontSize: 13, letterSpacing: 2, marginTop: 8, textTransform: 'uppercase' }}>Chăm sóc toàn diện cho quý ông đích thực</Text>
          <TouchableOpacity
            onPress={() => user ? nav.navigate('Booking', { screen: 'BookingMain' }) : nav.navigate('Auth')}
            style={{ borderWidth: 2, borderColor: '#c5a059', alignSelf: 'flex-start', marginTop: 16, paddingHorizontal: 32, paddingVertical: 12 }}
          >
            <Text style={{ color: '#c5a059', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, fontSize: 13 }}>Đặt lịch ngay</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Dịch vụ nổi bật</Text>
          <TouchableOpacity onPress={() => nav.navigate('Booking', { screen: 'BookingMain' })}>
            <Text style={{ color: '#c5a059', fontSize: 14 }}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {services.slice(0, 5).map((svc) => (
            <Card key={svc._id} className="mr-3 w-40">
              <Text style={{ fontSize: 28, marginBottom: 8 }}>💈</Text>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{svc.name}</Text>
              <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 8 }} />
              <Text style={{ color: '#c5a059', fontWeight: 'bold', fontSize: 18 }}>{formatPrice(svc.price)}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>{svc.durationMinutes} phút</Text>
            </Card>
          ))}
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Barber của chúng tôi</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {barbers.map((b) => <BarberCard key={b._id} barber={b} onPress={() => nav.navigate('Booking', { screen: 'BookingMain', params: { preselectedBarberId: b._id } })} />)}
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 32 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Đánh giá gần đây</Text>
        {barbers.slice(0, 2).map((b) => {
          const r = reviews[b._id];
          if (!r || r.length === 0) return null;
          return (
            <View key={b._id} style={{ marginBottom: 16 }}>
              <Text style={{ color: '#c5a059', fontWeight: 'bold', fontSize: 14, marginBottom: 8 }}>★ {b.rating.toFixed(1)} - {b.name}</Text>
              {r.slice(0, 2).map((rev) => <ReviewItem key={rev._id} review={rev} />)}
            </View>
          );
        })}
        {Object.values(reviews).every(r => r.length === 0) && <Card><Text style={{ color: '#9ca3af', textAlign: 'center' }}>Chưa có đánh giá nào</Text></Card>}
      </View>
    </ScrollView>
  );
}
