import { View, type ViewStyle } from 'react-native';

interface CardProps { children: React.ReactNode; className?: string; style?: ViewStyle }

export default function Card({ children, className = '', style }: CardProps) {
  return <View className={`bg-[#16213e] rounded-xl p-4 ${className}`} style={style}>{children}</View>;
}
