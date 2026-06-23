import { View, Text, memo } from 'react-native';

interface EmptyStateProps { title: string; message?: string }

const EmptyState = memo(function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
      <Text style={{ fontSize: 40, marginBottom: 16 }}>📭</Text>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>{title}</Text>
      {message && <Text style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center' }}>{message}</Text>}
    </View>
  );
});

export default EmptyState;
