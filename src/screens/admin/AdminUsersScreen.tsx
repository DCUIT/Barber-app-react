import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { authApi } from '../../api/auth';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import type { User } from '../../types/models';

const roleColors: Record<string, string> = { admin: '#ef4444', barber: '#3b82f6', user: '#10b981' };
const roleLabels: Record<string, string> = { admin: 'Admin', barber: 'Barber', user: 'User' };

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    try { const res = await authApi.getUsers(); if (mountedRef.current) setUsers(res.data || []); }
    catch {} finally { if (mountedRef.current) { setLoading(false); setRefreshing(false); } }
  }, []);

  useEffect(() => { mountedRef.current = true; fetch(); return () => { mountedRef.current = false; }; }, [fetch]);

  const toggleRole = async (u: User) => {
    const nr = u.role === 'user' ? 'barber' : u.role === 'barber' ? 'admin' : 'user';
    try { await authApi.updateUserRole(u._id, { role: nr }); Toast.show({ type: 'success', text1: `Đã đổi thành ${roleLabels[nr]}` }); fetch(); }
    catch (err: any) { Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg }); }
  };

  const toggleBlock = async (u: User) => {
    try { await authApi.blockUser(u._id, { isBlocked: !u.isBlocked }); Toast.show({ type: 'success', text1: u.isBlocked ? 'Đã mở khóa' : 'Đã khóa' }); fetch(); }
    catch { Toast.show({ type: 'error', text1: 'Thao tác thất bại' }); }
  };

  const deleteUser = async (id: string) => {
    try { await authApi.deleteUser(id); Toast.show({ type: 'success', text1: 'Đã xóa' }); fetch(); }
    catch { Toast.show({ type: 'error', text1: 'Xóa thất bại' }); }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetch} tintColor="#c5a059" />} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 16 }}>Người dùng ({users.length})</Text>
      {users.map((u) => (
        <Card key={u._id} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar uri={u.avatar} name={u.name} size={44} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{u.name || u.username}</Text>
              <Text style={{ color: '#9ca3af', fontSize: 12 }}>@{u.username}</Text>
            </View>
            <Badge label={roleLabels[u.role] || u.role} color={roleColors[u.role] || '#999'} />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#374151', gap: 8 }}>
            <TouchableOpacity onPress={() => toggleRole(u)} style={{ flex: 1, backgroundColor: '#2563eb', paddingVertical: 4, borderRadius: 4, alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>Đổi vai trò</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => toggleBlock(u)} style={{ flex: 1, backgroundColor: u.isBlocked ? '#059669' : '#ea580c', paddingVertical: 4, borderRadius: 4, alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{u.isBlocked ? 'Mở khóa' : 'Khóa'}</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => deleteUser(u._id)} style={{ flex: 1, backgroundColor: '#dc2626', paddingVertical: 4, borderRadius: 4, alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>Xóa</Text></TouchableOpacity>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}
