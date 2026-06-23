import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const nav = useNavigation<Nav>();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Họ tên là bắt buộc';
    if (!username.trim()) e.username = 'Tên đăng nhập là bắt buộc';
    if (!password) e.password = 'Mật khẩu là bắt buộc';
    else if (password.length < 6) e.password = 'Mật khẩu phải ít nhất 6 ký tự';
    if (password !== confirmPw) e.confirmPassword = 'Mật khẩu không khớp';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await register(name.trim(), username.trim(), password);
      Toast.show({ type: 'success', text1: 'Đăng ký thành công! Vui lòng đăng nhập.' });
      nav.navigate('Login');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg || 'Đăng ký thất bại!' });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>📝</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>Đăng ký tài khoản</Text>
        </View>
        <View style={{ backgroundColor: '#16213e', borderRadius: 16, padding: 24 }}>
          <Input label="Họ tên" placeholder="Nhập họ tên" value={name} onChangeText={setName} error={errors.name} />
          <Input label="Tên đăng nhập" placeholder="Nhập tên đăng nhập" value={username} onChangeText={setUsername} error={errors.username} autoCapitalize="none" />
          <Input label="Mật khẩu" placeholder="Ít nhất 6 ký tự" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry />
          <Input label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" value={confirmPw} onChangeText={setConfirmPw} error={errors.confirmPassword} secureTextEntry />
          <Button title="Đăng ký" onPress={handleRegister} loading={isLoading} />
          <TouchableOpacity onPress={() => nav.navigate('Login')} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: '#9ca3af' }}>Đã có tài khoản? <Text style={{ color: '#c5a059', fontWeight: 'bold' }}>Đăng nhập</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
