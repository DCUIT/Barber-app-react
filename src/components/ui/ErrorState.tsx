import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorStateProps { message: string; onRetry?: () => void }

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
      <Text style={{ fontSize: 40, marginBottom: 16 }}>⚠️</Text>
      <Text style={{ color: '#f87171', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>Có lỗi xảy ra</Text>
      <Text style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={{ backgroundColor: '#c5a059', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}>
          <Text style={{ color: '#000', fontWeight: 'bold' }}>Thử lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
