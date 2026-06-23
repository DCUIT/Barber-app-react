import { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { authApi } from '../../api/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ChangePasswordScreen() {
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!current) e.current = 'Vui lòng nhập mật khẩu hiện tại';
    if (!newPw) e.newPw = 'Vui lòng nhập mật khẩu mới';
    else if (newPw.length < 6) e.newPw = 'Mật khẩu phải ít nhất 6 ký tự';
    if (newPw !== confirm) e.confirm = 'Mật khẩu không khớp';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = useCallback(async () => {
    if (!validate()) return;
    setLoading(true);
    try { await authApi.changePassword({ currentPassword: current, newPassword: newPw }); Toast.show({ type: 'success', text1: 'Đổi mật khẩu thành công!' }); setCurrent(''); setNewPw(''); setConfirm(''); }
    catch (err: any) { Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg || 'Đổi mật khẩu thất bại' }); }
    finally { setLoading(false); }
  }, [current, newPw, confirm]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} contentContainerStyle={{ paddingVertical: 32 }}>
      <View style={{ backgroundColor: '#16213e', borderRadius: 16, padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 24 }}>Đổi mật khẩu</Text>
        <Input label="Mật khẩu hiện tại" placeholder="Nhập mật khẩu hiện tại" value={current} onChangeText={setCurrent} error={errors.current} secureTextEntry />
        <Input label="Mật khẩu mới" placeholder="Ít nhất 6 ký tự" value={newPw} onChangeText={setNewPw} error={errors.newPw} secureTextEntry />
        <Input label="Xác nhận mật khẩu mới" placeholder="Nhập lại mật khẩu mới" value={confirm} onChangeText={setConfirm} error={errors.confirm} secureTextEntry />
        <Button title="Đổi mật khẩu" onPress={handleChange} loading={loading} />
      </View>
    </ScrollView>
  );
}
