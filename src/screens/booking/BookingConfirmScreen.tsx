import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Button from '../../components/ui/Button';
import { formatPrice, formatDate } from '../../utils/format';

export default function BookingConfirmScreen() {
  const route = useRoute<any>();
  const booking = route.params?.booking;

  if (!booking) return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
      <Text style={{ fontSize: 40, marginBottom: 16 }}>❌</Text>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Không có thông tin đặt lịch</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 24, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>✅</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>Đặt lịch thành công!</Text>
        <Text style={{ color: '#9ca3af', marginTop: 8 }}>Cảm ơn bạn đã đặt lịch tại The Cutting Edge</Text>
      </View>
      <View style={{ backgroundColor: '#16213e', borderRadius: 16, padding: 24, marginBottom: 32 }}>
        <Text style={{ color: '#9ca3af', fontSize: 13 }}>Dịch vụ</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{booking.serviceId?.name}</Text>
        <Text style={{ color: '#c5a059', fontWeight: 'bold', fontSize: 20 }}>{formatPrice(booking.serviceId?.price)}</Text>
        <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 12 }} />
        <Text style={{ color: '#9ca3af', fontSize: 13 }}>Barber</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{booking.barberId?.name}</Text>
        <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 12 }} />
        <Text style={{ color: '#9ca3af', fontSize: 13 }}>Thời gian</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{formatDate(booking.bookingDate)} lúc {booking.bookingTime}</Text>
        {booking.note && (
          <>
            <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 12 }} />
            <Text style={{ color: '#9ca3af', fontSize: 13 }}>Ghi chú</Text>
            <Text style={{ color: '#fff' }}>{booking.note}</Text>
          </>
        )}
      </View>
      <Button title="Xem lịch sử đặt lịch" variant="outline" onPress={() => {}} />
    </View>
  );
}
