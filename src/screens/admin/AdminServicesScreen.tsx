import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import { servicesApi } from '../../api/services';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Modal from '../../components/ui/Modal';
import { formatPrice } from '../../utils/format';
import type { Service } from '../../types/models';

export default function AdminServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', price: '', duration: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    try { const res = await servicesApi.getAll(); setServices(res.data || []); }
    catch {} finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); setForm({ name: '', price: '', duration: '', description: '' }); setModal(true); };
  const openEdit = (svc: Service) => { setEditing(svc); setForm({ name: svc.name, price: String(svc.price), duration: String(svc.durationMinutes), description: svc.description || '' }); setModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) { Toast.show({ type: 'error', text1: 'Vui lòng điền đầy đủ' }); return; }
    setSaving(true);
    try {
      const data = { name: form.name, price: Number(form.price), duration: Number(form.duration), description: form.description };
      if (editing) { await servicesApi.update(editing._id, data); Toast.show({ type: 'success', text1: 'Đã cập nhật' }); }
      else { await servicesApi.create(data); Toast.show({ type: 'success', text1: 'Đã tạo' }); }
      setModal(false); fetch();
    } catch (err: any) { Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.msg }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await servicesApi.delete(id); Toast.show({ type: 'success', text1: 'Đã xóa' }); fetch(); }
    catch { Toast.show({ type: 'error', text1: 'Xóa thất bại' }); }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetch} tintColor="#c5a059" />} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 16 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Dịch vụ ({services.length})</Text>
        <TouchableOpacity onPress={openCreate} style={{ backgroundColor: '#c5a059', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}><Text style={{ color: '#000', fontWeight: 'bold' }}>+ Thêm</Text></TouchableOpacity>
      </View>
      {services.map((svc) => (
        <Card key={svc._id} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{svc.name}</Text>
              <Text style={{ color: '#c5a059', fontWeight: 'bold', fontSize: 18 }}>{formatPrice(svc.price)}</Text>
              <Text style={{ color: '#9ca3af', fontSize: 12 }}>{svc.durationMinutes} phút</Text>
            </View>
            <View style={{ gap: 8 }}>
              <TouchableOpacity onPress={() => openEdit(svc)} style={{ backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 }}><Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Sửa</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(svc._id)} style={{ backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 }}><Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Xóa</Text></TouchableOpacity>
            </View>
          </View>
        </Card>
      ))}
      <Modal visible={modal} onClose={() => setModal(false)} title={editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}>
        <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 }} placeholder="Tên dịch vụ" placeholderTextColor="#9ca3af" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
        <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 }} placeholder="Giá (VNĐ)" placeholderTextColor="#9ca3af" value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} keyboardType="numeric" />
        <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 }} placeholder="Thời gian (phút)" placeholderTextColor="#9ca3af" value={form.duration} onChangeText={(v) => setForm({ ...form, duration: v })} keyboardType="numeric" />
        <TextInput style={{ backgroundColor: '#fff', color: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 }} placeholder="Mô tả" placeholderTextColor="#9ca3af" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline />
        <Button title={editing ? 'Cập nhật' : 'Tạo mới'} onPress={handleSave} loading={saving} />
      </Modal>
    </ScrollView>
  );
}
