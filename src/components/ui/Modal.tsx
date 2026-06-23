import { View, Text, Modal as RNModal, TouchableOpacity, memo } from 'react-native';

interface ModalProps { visible: boolean; onClose: () => void; title?: string; children: React.ReactNode }

const Modal = memo(function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 24 }}>
        <View style={{ backgroundColor: '#16213e', borderRadius: 16, width: '100%', maxWidth: 400, padding: 24 }}>
          {title && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={{ color: '#9ca3af', fontSize: 22 }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {children}
        </View>
      </View>
    </RNModal>
  );
});

export default Modal;
