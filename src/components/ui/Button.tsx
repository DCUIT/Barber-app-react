import { TouchableOpacity, Text, ActivityIndicator, type ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled, className = '', style }: ButtonProps) {
  const bg = variant === 'primary' ? 'bg-[#c5a059]' : variant === 'secondary' ? 'bg-[#8b0000]' : 'border-2 border-[#c5a059]';
  const txt = variant === 'outline' ? 'text-[#c5a059]' : 'text-black';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-lg items-center justify-center flex-row py-3 px-6 ${bg} ${disabled ? 'opacity-50' : ''} ${className}`}
      style={style}
    >
      {loading && <ActivityIndicator size="small" color={variant === 'outline' ? '#c5a059' : '#000'} style={{ marginRight: 8 }} />}
      <Text className={`font-bold uppercase tracking-wider text-sm ${txt}`}>{title}</Text>
    </TouchableOpacity>
  );
}
