import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import { barbersApi } from '../../api/barbers';
import BarberCard from '../../components/BarberCard';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Modal from '../../components/ui/Modal';
import type { Barber } from '../../types/models';

export default function AdminBarbersScreen() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Barber | null>(null);
  const [form, setForm] = useState({ name: '', specialty: '', experience: '', avatar: '' });
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    try { const res = await barbersApi.getAll(); setBarbers(res.data || []); }
    catch {} finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); setForm({ name: '', specialty: '', experience: '', avatar: '' }); setModal(true); };
  const openEdit = (b: Barber) => { setEditing(b); setForm({ name: b.name, specialty: b.specialty || '', experience: String(b.experienceYears || 0), avatar: b.avatar || '' }); setModal(true); };

  const handleSave = async () => {
    if (!form.name) { Toast.show({ type: 'error', text1: 'Vui lòng nhập tên' }); return; }
    setSaving(true);
    try {
      const data = { name: form.name, specialty: form.specialty, experience: Number(form.experience) || 0, avatar: form.avatar };
      if (editing) { await barbersApi.update(editing._id, data); Toast.show({ type: 'success', text1: 'Đã cập nhật' }); }
      else { await barbersApi.create(data); Toast.show({ type: 'success', text1: 'Đã thêm' }); }
      setModal(false); fetch();
    } catch (err: any) { Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await barbersApi.delete(id); Toast.show({ type: 'success', text1: 'Đã xóa' }); fetch(); }
    catch { Toast.show({ type: 'error', text1: 'Xóa thất bại' }); }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetch} tintColor="#c5a059" />} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 16 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Barber ({barbers.length})</Text>
        <TouchableOpacity onPress={openCreate} style={{ backgroundColor: '#c5a059', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}><Text style={{ color: '#000', fontWeight: 'bold' }}>+ Thêm</Text></TouchableOpacity>
      </View>
      {barbers.map((b) => (
        <View key={b._id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#374151' }}>
          <BarberCard barber={b} />
          <View style={{ marginLeft: 'auto', gap: 8 }}>
            <TouchableOpacity onPress={() => openEdit(b)} style={{ backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 }}><Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Sửa</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(b._id)} style={{ backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 }}><Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Xóa</Text></TouchableOpacity>
          </View>
        </View>
      ))}
      <Modal visible={modal} onClose={() => setModal(false)} title={editing ? 'Sửa barber' : 'Thêm barber'}>
        <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 }} placeholder="Tên barber" placeholderTextColor="#9ca3af" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
        <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 }} placeholder="Chuyên môn" placeholderTextColor="#9ca3af" value={form.specialty} onChangeText={(v) => setForm({ ...form, specialty: v })} />
        <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 }} placeholder="Số năm KN" placeholderTextColor="#9ca3af" value={form.experience} onChangeText={(v) => setForm({ ...form, experience: v })} keyboardType="numeric" />
        <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 }} placeholder="Avatar URL" placeholderTextColor="#9ca3af" value={form.avatar} onChangeText={(v) => setForm({ ...form, avatar: v })} />
        <Button title={editing ? 'Cập nhật' : 'Thêm mới'} onPress={handleSave} loading={saving} />
      </Modal>
    </ScrollView>
  );
}
