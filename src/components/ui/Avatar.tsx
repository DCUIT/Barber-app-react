import { Image, View, Text } from 'react-native';

interface AvatarProps { uri?: string; name?: string; size?: number }

export default function Avatar({ uri, name, size = 48 }: AvatarProps) {
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#c5a059', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: size * 0.4, color: '#000', fontWeight: 'bold' }}>{initials}</Text>
    </View>
  );
}
