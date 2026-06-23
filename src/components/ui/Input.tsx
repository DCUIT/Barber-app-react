import { View, Text, TextInput as RNInput, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={{ color: '#9ca3af', fontSize: 13, fontWeight: '600', marginBottom: 4 }}>{label}</Text>}
      <RNInput
        className={`bg-white text-black rounded-lg px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-600'} ${className}`}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</Text>}
    </View>
  );
}
