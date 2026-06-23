import { View, Text } from 'react-native';

interface BadgeProps { label: string; color?: string }

export default function Badge({ label, color = '#c5a059' }: BadgeProps) {
  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: color + '30' }}>
      <Text style={{ color, fontSize: 12, fontWeight: 'bold' }}>{label}</Text>
    </View>
  );
}
