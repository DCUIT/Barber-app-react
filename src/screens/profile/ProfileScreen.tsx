import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ProfileScreen() {
  const nav = useNavigation<any>();
  const { user, logout, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const roleLabel = user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'barber' ? 'Barber' : 'Khách hàng';

  const handleSave = async () => {
    setSaving(true);
    try { const res = await authApi.updateProfile({ name, phone, avatar }); setUser(res.data); Toast.show({ type: 'success', text1: 'Cập nhật thành công' }); setEditing(false); }
    catch (err: any) { Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg || 'Cập nhật thất bại' }); }
    finally { setSaving(false); }
  };

  const handleLogout = async () => { await logout(); Toast.show({ type: 'success', text1: 'Đã đăng xuất' }); };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ alignItems: 'center', marginVertical: 32 }}>
        <Avatar uri={user?.avatar} name={user?.name} size={96} />
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 16 }}>{user?.name}</Text>
        <View style={{ backgroundColor: 'rgba(197,160,89,0.2)', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginTop: 8 }}>
          <Text style={{ color: '#c5a059', fontSize: 13, fontWeight: 'bold' }}>{roleLabel}</Text>
        </View>
        <Text style={{ color: '#9ca3af', marginTop: 4 }}>@{user?.username}</Text>
      </View>

      <Card style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Thông tin cá nhân</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}><Text style={{ color: '#c5a059', fontSize: 14 }}>{editing ? 'Hủy' : 'Chỉnh sửa'}</Text></TouchableOpacity>
        </View>
        {editing ? (
          <>
            <Input label="Họ tên" value={name} onChangeText={setName} />
            <Input label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Input label="Avatar URL" value={avatar} onChangeText={setAvatar} />
            <Button title="Lưu thay đổi" onPress={handleSave} loading={saving} />
          </>
        ) : (
          <>
            <Text style={{ color: '#9ca3af', fontSize: 13 }}>Số điện thoại</Text>
            <Text style={{ color: '#fff' }}>{user?.phone || 'Chưa cập nhật'}</Text>
            <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 8 }} />
            <Text style={{ color: '#9ca3af', fontSize: 13 }}>Vai trò</Text>
            <Text style={{ color: '#fff' }}>{roleLabel}</Text>
          </>
        )}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <TouchableOpacity onPress={() => nav.navigate('BookingHistory')} style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>📋</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lịch sử đặt lịch</Text>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>Xem các lịch hẹn của bạn</Text>
          </View>
          <Text style={{ color: '#6b7280', fontSize: 20 }}>›</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: '#374151' }} />
        <TouchableOpacity onPress={() => nav.navigate('ChangePassword')} style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>🔑</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đổi mật khẩu</Text>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>Cập nhật mật khẩu của bạn</Text>
          </View>
          <Text style={{ color: '#6b7280', fontSize: 20 }}>›</Text>
        </TouchableOpacity>
      </Card>

      <Button title="Đăng xuất" variant="secondary" onPress={handleLogout} />
    </ScrollView>
  );
}
