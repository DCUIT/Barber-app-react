import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { servicesApi } from '../../api/services';
import { barbersApi } from '../../api/barbers';
import { bookingsApi } from '../../api/bookings';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import BarberCard from '../../components/BarberCard';
import ServiceCard from '../../components/ServiceCard';
import TimeSlot from '../../components/TimeSlot';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { toDateInputString } from '../../utils/format';
import type { Service, Barber } from '../../types/models';

type Step = 'service' | 'barber' | 'datetime' | 'note';

export default function BookingScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAuthStore((s) => s.user);
  const store = useBookingStore();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('service');

  const preselectedBarberId = route.params?.preselectedBarberId;

  useEffect(() => {
    const fetch = async () => {
      try {
        const [svcRes, barRes] = await Promise.all([servicesApi.getAll(), barbersApi.getAll()]);
        setServices(svcRes.data || []);
        setBarbers(barRes.data || []);
        if (preselectedBarberId) {
          const barber = (barRes.data || []).find((b) => b._id === preselectedBarberId);
          if (barber) { store.setBarber(barber); setStep('service'); }
        }
      } catch { Toast.show({ type: 'error', text1: 'Không thể tải dữ liệu' }); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const fetchSlots = useCallback(async () => {
    if (!store.draft.barber || !store.draft.date) return;
    setLoadingSlots(true);
    try { const res = await bookingsApi.getCalendar(store.draft.barber._id, store.draft.date); setSlots(res.data?.slots || []); }
    catch { setSlots([]); } finally { setLoadingSlots(false); }
  }, [store.draft.barber, store.draft.date]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const today = toDateInputString(new Date());
  const canProceed = () => step === 'service' ? !!store.draft.service : step === 'barber' ? !!store.draft.barber : step === 'datetime' ? !!store.draft.date && !!store.draft.time : true;

  const next = () => { const o: Step[] = ['service', 'barber', 'datetime', 'note']; const i = o.indexOf(step); if (i < 3) setStep(o[i + 1]); };
  const prev = () => { const o: Step[] = ['service', 'barber', 'datetime', 'note']; const i = o.indexOf(step); if (i > 0) setStep(o[i - 1]); };

  const handleConfirm = async () => {
    if (!user) { nav.navigate('Auth'); return; }
    if (!store.draft.service || !store.draft.barber || !store.draft.date || !store.draft.time) {
      Toast.show({ type: 'error', text1: 'Vui lòng chọn đầy đủ thông tin' }); return;
    }
    try {
      await bookingsApi.create({ barberId: store.draft.barber._id, serviceId: store.draft.service._id, bookingDate: store.draft.date, bookingTime: store.draft.time, note: store.draft.note });
      Toast.show({ type: 'success', text1: 'Đặt lịch thành công!' });
      store.resetDraft();
      nav.navigate('Profile', { screen: 'BookingHistory' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Đặt lịch thất bại', text2: err?.response?.data?.msg || 'Vui lòng thử lại' });
    }
  };

  if (loading) return <Loading fullScreen />;

  const steps: Step[] = ['service', 'barber', 'datetime', 'note'];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Step indicators */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16 }}>
        {steps.map((s, i) => (
          <TouchableOpacity key={s} onPress={() => { if (i <= steps.indexOf(step)) setStep(s); }}
            style={{ marginHorizontal: 4, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
              backgroundColor: step === s ? '#c5a059' : i < steps.indexOf(step) ? '#059669' : '#374151' }}>
            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>{i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Step content */}
      {step === 'service' && (
        <View>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>1. Chọn dịch vụ</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {services.map((svc) => (
              <View key={svc._id} style={{ marginBottom: 12, width: '50%', paddingRight: 8 }}>
                <ServiceCard service={svc} selected={store.draft.service?._id === svc._id} onPress={() => store.setService(svc)} />
              </View>
            ))}
          </View>
        </View>
      )}

      {step === 'barber' && (
        <View>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>2. Chọn Barber</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {barbers.map((b) => <BarberCard key={b._id} barber={b} selected={store.draft.barber?._id === b._id} onPress={() => store.setBarber(b)} />)}
          </ScrollView>
        </View>
      )}

      {step === 'datetime' && (
        <View>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>3. Chọn ngày & giờ</Text>
          <Text style={{ color: '#9ca3af', fontSize: 13, marginBottom: 8 }}>Chọn ngày:</Text>
          <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 }}
            placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" value={store.draft.date}
            onChangeText={(v) => { store.setDate(v); store.setTime(''); }} />
          {store.draft.date >= today && (
            <>
              <Text style={{ color: '#9ca3af', fontSize: 13, marginBottom: 8 }}>Chọn giờ:</Text>
              {loadingSlots ? <ActivityIndicator color="#c5a059" style={{ paddingVertical: 16 }} /> : slots.length === 0
                ? <Card><Text style={{ color: '#9ca3af', textAlign: 'center' }}>Không có khung giờ trống</Text></Card>
                : <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {slots.map((slot) => (
                      <View key={slot} style={{ width: '30%' }}>
                        <TimeSlot time={slot} selected={store.draft.time === slot} onPress={() => store.setTime(slot)} />
                      </View>
                    ))}
                  </View>
              }
            </>
          )}
        </View>
      )}

      {step === 'note' && (
        <View>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>4. Ghi chú & Xác nhận</Text>
          <Card style={{ marginBottom: 16 }}>
            <Text style={{ color: '#9ca3af', fontSize: 13 }}>Dịch vụ:</Text>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{store.draft.service?.name}</Text>
            <Text style={{ color: '#c5a059', fontWeight: 'bold', fontSize: 20 }}>{store.draft.service?.price?.toLocaleString('vi-VN')}đ</Text>
            <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 12 }} />
            <Text style={{ color: '#9ca3af', fontSize: 13 }}>Barber:</Text>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{store.draft.barber?.name}</Text>
            <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 12 }} />
            <Text style={{ color: '#9ca3af', fontSize: 13 }}>Thời gian:</Text>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{store.draft.date} lúc {store.draft.time}</Text>
          </Card>
          <TextInput style={{ backgroundColor: '#16213e', color: '#fff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#374151', marginBottom: 16, minHeight: 80 }}
            placeholder="Ghi chú thêm (không bắt buộc)" placeholderTextColor="#9ca3af" value={store.draft.note} onChangeText={store.setNote} multiline />
        </View>
      )}

      <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
        {step !== 'service' && <View style={{ flex: 1 }}><Button title="Quay lại" variant="outline" onPress={prev} /></View>}
        <View style={{ flex: 1 }}>
          {step !== 'note' ? <Button title="Tiếp theo" onPress={next} disabled={!canProceed()} /> : <Button title="Xác nhận đặt lịch" onPress={handleConfirm} />}
        </View>
      </View>
    </ScrollView>
  );
}
