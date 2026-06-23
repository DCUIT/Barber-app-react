import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const nav = useNavigation<Nav>();
  const { login, isLoading } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = 'Tên đăng nhập là bắt buộc';
    if (!password.trim()) e.password = 'Mật khẩu là bắt buộc';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await login(username.trim(), password);
      Toast.show({ type: 'success', text1: 'Đăng nhập thành công!' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg || 'Sai tài khoản hoặc mật khẩu!' });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 8 }}>💈</Text>
          <Text style={{ color: '#c5a059', fontSize: 28, fontWeight: '900', textAlign: 'center' }}>THE CUTTING EDGE</Text>
          <Text style={{ color: '#9ca3af', fontSize: 13, marginTop: 8, letterSpacing: 2, textTransform: 'uppercase' }}>Barber Booking</Text>
        </View>
        <View style={{ backgroundColor: '#16213e', borderRadius: 16, padding: 24 }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>Đăng nhập</Text>
          <Input label="Tên đăng nhập" placeholder="Nhập tên đăng nhập" value={username} onChangeText={setUsername} error={errors.username} autoCapitalize="none" />
          <Input label="Mật khẩu" placeholder="Nhập mật khẩu" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry />
          <Button title="Đăng nhập" onPress={handleLogin} loading={isLoading} />
          <TouchableOpacity onPress={() => nav.navigate('Register')} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: '#9ca3af' }}>Chưa có tài khoản? <Text style={{ color: '#c5a059', fontWeight: 'bold' }}>Đăng ký</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
