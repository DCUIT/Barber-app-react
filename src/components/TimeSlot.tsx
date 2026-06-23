import { TouchableOpacity, Text, memo } from 'react-native';

interface TimeSlotProps { time: string; selected?: boolean; onPress?: () => void; disabled?: boolean }

const TimeSlot = memo(function TimeSlot({ time, selected, onPress, disabled }: TimeSlotProps) {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      className={`py-3 px-4 rounded-lg items-center ${selected ? 'bg-[#c5a059]' : disabled ? 'bg-gray-800' : 'bg-[#16213e] border border-gray-600'}`}
    >
      <Text className={`font-bold text-sm ${selected ? 'text-black' : disabled ? 'text-gray-600' : 'text-white'}`}>{time}</Text>
    </TouchableOpacity>
  );
});

export default TimeSlot;
