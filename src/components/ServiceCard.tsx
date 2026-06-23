import { View, Text, TouchableOpacity } from 'react-native';
import { formatPrice } from '../utils/format';
import type { Service } from '../types/models';

interface ServiceCardProps { service: Service; selected?: boolean; onPress?: () => void }

export default function ServiceCard({ service, selected, onPress }: ServiceCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-[#16213e] rounded-xl p-4 mr-3 w-36 ${selected ? 'border-2 border-[#c5a059]' : 'border border-gray-700'}`}
    >
      <Text style={{ fontSize: 24, marginBottom: 8 }}>💈</Text>
      <Text className="text-white font-bold text-sm">{service.name}</Text>
      <Text className="text-[#c5a059] font-bold text-lg mt-2">{formatPrice(service.price)}</Text>
      <Text className="text-gray-500 text-xs mt-1">{service.durationMinutes} phút</Text>
    </TouchableOpacity>
  );
}
