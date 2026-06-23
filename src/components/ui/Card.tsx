import { View, memo, type ViewStyle } from 'react-native';

interface CardProps { children: React.ReactNode; className?: string; style?: ViewStyle }

const Card = memo(function Card({ children, className = '', style }: CardProps) {
  return <View className={`bg-[#16213e] rounded-xl p-4 ${className}`} style={style}>{children}</View>;
});

export default Card;
