import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { servicesApi } from '../../api/services';
import { barbersApi } from '../../api/barbers';
import { bookingsApi } from '../../api/bookings';
import { useAuthStore, selectUser } from '../../store/authStore';
import { useBookingStore, selectDraft } from '../../store/bookingStore';
import BarberCard from '../../components/BarberCard';
import ServiceCard from '../../components/ServiceCard';
import TimeSlot from '../../components/TimeSlot';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { toDateInputString } from '../../utils/format';
import type { Service, Barber } from '../../types/models';

type Step = 'service' | 'barber' | 'datetime' | 'note';
const STEPS: Step[] = ['service', 'barber', 'datetime', 'note'];
const STEP_LABELS: Record<Step, string> = { service: 'Chọn dịch vụ', barber: 'Chọn Barber', datetime: 'Chọn ngày & giờ', note: 'Ghi chú & Xác nhận' };

function StepIndicator({ step }: { step: Step }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16 }}>
      {STEPS.map((s, i) => (
        <View key={s} style={{ marginHorizontal: 4, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
          backgroundColor: step === s ? '#c5a059' : i < STEPS.indexOf(step) ? '#059669' : '#374151',
        }}>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>{i + 1}</Text>
        </View>
      ))}
    </View>
  );
}

function StepService({ services, selectedId, onSelect }: { services: Service[]; selectedId?: string; onSelect: (s: Service) => void }) {
  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>1. {STEP_LABELS.service}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {services.map((svc) => (
          <View key={svc._id} style={{ marginBottom: 12, width: '50%', paddingRight: 8 }}>
            <ServiceCard service={svc} selected={selectedId === svc._id} onPress={() => onSelect(svc)} />
          </View>
        ))}
      </View>
    </View>
  );
}

function StepBarber({ barbers, selectedId, onSelect }: { barbers: Barber[]; selectedId?: string; onSelect: (b: Barber) => void }) {
  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>2. {STEP_LABELS.barber}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {barbers.map((b) => <BarberCard key={b._id} barber={b} selected={selectedId === b._id} onPress={() => onSelect(b)} />)}
      </ScrollView>
    </View>
  );
}

function StepDateTime({ date, time, slots, loadingSlots, today, onDateChange, onTimeChange }: {
  date: string; time: string; slots: string[]; loadingSlots: boolean; today: string;
  onDateChange: (d: string) => void; onTimeChange: (t: string) => void;
}) {
  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>3. {STEP_LABELS.datetime}</Text>
      <Text style={{ color: '#9ca3af', fontSize: 13, marginBottom: 8 }}>Chọn ngày:</Text>
      <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 }}
        placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" value={date}
        onChangeText={onDateChange} />
      {date >= today && (
        <>
          <Text style={{ color: '#9ca3af', fontSize: 13, marginBottom: 8 }}>Chọn giờ:</Text>
          {loadingSlots ? <ActivityIndicator color="#c5a059" style={{ paddingVertical: 16 }} />
          : slots.length === 0
            ? <Card><Text style={{ color: '#9ca3af', textAlign: 'center' }}>Không có khung giờ trống</Text></Card>
            : <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {slots.map((slot) => (
                  <View key={slot} style={{ width: '30%' }}>
                    <TimeSlot time={slot} selected={time === slot} onPress={() => onTimeChange(slot)} />
                  </View>
                ))}
              </View>
          }
        </>
      )}
    </View>
  );
}

function StepNote({ draft, onNoteChange }: { draft: { service?: { name: string; price: number } | null; barber?: { name: string } | null; date: string; time: string; note: string }; onNoteChange: (n: string) => void }) {
  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>4. {STEP_LABELS.note}</Text>
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ color: '#9ca3af', fontSize: 13 }}>Dịch vụ:</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{draft.service?.name}</Text>
        <Text style={{ color: '#c5a059', fontWeight: 'bold', fontSize: 20 }}>{draft.service?.price?.toLocaleString('vi-VN')}đ</Text>
        <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 12 }} />
        <Text style={{ color: '#9ca3af', fontSize: 13 }}>Barber:</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{draft.barber?.name}</Text>
        <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 12 }} />
        <Text style={{ color: '#9ca3af', fontSize: 13 }}>Thời gian:</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{draft.date} lúc {draft.time}</Text>
      </Card>
      <TextInput style={{ backgroundColor: '#16213e', color: '#fff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#374151', marginBottom: 16, minHeight: 80 }}
        placeholder="Ghi chú thêm (không bắt buộc)" placeholderTextColor="#9ca3af" value={draft.note} onChangeText={onNoteChange} multiline />
    </View>
  );
}

export default function BookingScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAuthStore(selectUser);
  const draft = useBookingStore(selectDraft);
  const { setService, setBarber, setDate, setTime, setNote, resetDraft } = useBookingStore();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('service');
  const mountedRef = useRef(true);

  const preselectedBarberId = route.params?.preselectedBarberId;

  useEffect(() => {
    mountedRef.current = true;
    const fetch = async () => {
      try {
        const [svcRes, barRes] = await Promise.all([servicesApi.getAll(), barbersApi.getAll()]);
        if (!mountedRef.current) return;
        setServices(svcRes.data || []);
        setBarbers(barRes.data || []);
        if (preselectedBarberId) {
          const barber = (barRes.data || []).find((b) => b._id === preselectedBarberId);
          if (barber) setBarber(barber);
        }
      } catch { if (mountedRef.current) Toast.show({ type: 'error', text1: 'Không thể tải dữ liệu' }); }
      finally { if (mountedRef.current) setLoading(false); }
    };
    fetch();
    return () => { mountedRef.current = false; };
  }, []);

  const fetchSlots = useCallback(async () => {
    if (!draft.barber?._id || !draft.date) return;
    setLoadingSlots(true);
    try { const res = await bookingsApi.getCalendar(draft.barber._id, draft.date); if (mountedRef.current) setSlots(res.data?.slots || []); }
    catch { if (mountedRef.current) setSlots([]); } finally { if (mountedRef.current) setLoadingSlots(false); }
  }, [draft.barber?._id, draft.date]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const today = toDateInputString(new Date());
  const canProceed = () => step === 'service' ? !!draft.service : step === 'barber' ? !!draft.barber : step === 'datetime' ? !!draft.date && !!draft.time : true;

  const next = () => { const i = STEPS.indexOf(step); if (i < 3) setStep(STEPS[i + 1]); };
  const prev = () => { const i = STEPS.indexOf(step); if (i > 0) setStep(STEPS[i - 1]); };

  const handleConfirm = async () => {
    if (!user) { nav.navigate('Auth'); return; }
    if (!draft.service || !draft.barber || !draft.date || !draft.time) {
      Toast.show({ type: 'error', text1: 'Vui lòng chọn đầy đủ thông tin' }); return;
    }
    try {
      await bookingsApi.create({ barberId: draft.barber._id, serviceId: draft.service._id, bookingDate: draft.date, bookingTime: draft.time, note: draft.note });
      Toast.show({ type: 'success', text1: 'Đặt lịch thành công!' });
      resetDraft();
      nav.navigate('Profile', { screen: 'BookingHistory' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Đặt lịch thất bại', text2: err?.response?.data?.msg || 'Vui lòng thử lại' });
    }
  };

  const handleDateChange = useCallback((d: string) => { setDate(d); }, []);
  const handleTimeChange = useCallback((t: string) => { setTime(t); }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 32 }}>
      <StepIndicator step={step} />

      {step === 'service' && <StepService services={services} selectedId={draft.service?._id} onSelect={setService} />}
      {step === 'barber' && <StepBarber barbers={barbers} selectedId={draft.barber?._id} onSelect={setBarber} />}
      {step === 'datetime' && (
        <StepDateTime date={draft.date} time={draft.time} slots={slots} loadingSlots={loadingSlots} today={today}
          onDateChange={handleDateChange} onTimeChange={handleTimeChange} />
      )}
      {step === 'note' && <StepNote draft={draft} onNoteChange={setNote} />}

      <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
        {step !== 'service' && <View style={{ flex: 1 }}><Button title="Quay lại" variant="outline" onPress={prev} /></View>}
        <View style={{ flex: 1 }}>
          {step !== 'note' ? <Button title="Tiếp theo" onPress={next} disabled={!canProceed()} /> : <Button title="Xác nhận đặt lịch" onPress={handleConfirm} />}
        </View>
      </View>
    </ScrollView>
  );
}
