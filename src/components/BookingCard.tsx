import { View, Text, TouchableOpacity } from 'react-native';
import Badge from './ui/Badge';
import { formatPrice, formatDate } from '../utils/format';
import { STATUS_MAP } from '../utils/constants';
import type { Booking } from '../types/models';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
  showActions?: boolean;
  onAccept?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function BookingCard({ booking, onPress, showActions, onAccept, onComplete, onCancel }: BookingCardProps) {
  const s = STATUS_MAP[booking.status] || { label: booking.status, color: '#999' };
  return (
    <TouchableOpacity onPress={onPress} className="bg-[#16213e] rounded-xl p-4 mb-3 border border-gray-700">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text className="text-white font-bold text-base">{booking.serviceId?.name || 'Dịch vụ'}</Text>
          <Text className="text-gray-400 text-sm mt-1">{booking.barberId?.name || 'Barber'}</Text>
        </View>
        <Badge label={s.label} color={s.color} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text className="text-gray-400 text-sm">📅 {formatDate(booking.bookingDate)}</Text>
        <Text className="text-gray-400 text-sm" style={{ marginLeft: 16 }}>🕐 {booking.bookingTime}</Text>
      </View>
      {booking.note ? <Text className="text-gray-500 text-xs mb-2">📝 {booking.note}</Text> : null}
      <Text className="text-[#c5a059] font-bold">{formatPrice(booking.serviceId?.price || 0)}</Text>

      {showActions && booking.status === 'Pending' && (
        <View style={{ flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#374151', gap: 8 }}>
          {onAccept && (
            <TouchableOpacity onPress={onAccept} style={{ flex: 1, backgroundColor: '#059669', paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Chấp nhận</Text>
            </TouchableOpacity>
          )}
          {onCancel && (
            <TouchableOpacity onPress={onCancel} style={{ flex: 1, backgroundColor: '#dc2626', paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Từ chối</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {showActions && booking.status === 'Accepted' && onComplete && (
        <TouchableOpacity onPress={onComplete} style={{ marginTop: 12, backgroundColor: '#2563eb', paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Hoàn thành</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
