import { View, Text, TouchableOpacity } from 'react-native';
import Avatar from './ui/Avatar';
import type { Barber } from '../types/models';

interface BarberCardProps { barber: Barber; selected?: boolean; onPress?: () => void }

export default function BarberCard({ barber, selected, onPress }: BarberCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-[#16213e] rounded-xl p-4 mr-3 w-40 ${selected ? 'border-2 border-[#c5a059]' : 'border border-gray-700'}`}
    >
      <Avatar uri={barber.avatar} name={barber.name} size={64} />
      <Text style={{ marginTop: 12 }} className="text-white font-bold text-sm text-center">{barber.name}</Text>
      <Text className="text-gray-400 text-xs text-center mt-1">{barber.specialty}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
        <Text className="text-[#c5a059] text-xs">★ {barber.rating.toFixed(1)}</Text>
        <Text className="text-gray-500 text-xs ml-1">({barber.reviewCount})</Text>
      </View>
      <Text className="text-gray-500 text-xs text-center mt-1">{barber.experienceYears} năm KN</Text>
    </TouchableOpacity>
  );
}
