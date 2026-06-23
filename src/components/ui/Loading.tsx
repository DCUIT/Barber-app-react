import { View, ActivityIndicator, Text, memo } from 'react-native';

interface LoadingProps { message?: string; fullScreen?: boolean }

const Loading = memo(function Loading({ message, fullScreen }: LoadingProps) {
  if (fullScreen) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#c5a059" />
        {message && <Text style={{ color: '#9ca3af', marginTop: 16, fontSize: 14 }}>{message}</Text>}
      </View>
    );
  }
  return (
    <View style={{ paddingVertical: 32, alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#c5a059" />
      {message && <Text style={{ color: '#9ca3af', marginTop: 8, fontSize: 13 }}>{message}</Text>}
    </View>
  );
});

export default Loading;
