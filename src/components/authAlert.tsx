import { Text, View, TouchableOpacity } from 'react-native';

interface AuthAlertProps {
  message: string | null;
  onClose: () => void;
}

export default function AuthAlert({ message, onClose }: AuthAlertProps) {
  if (!message) return null;

  return (
    <View className="w-full p-4 mb-4 bg-red-50 border border-red-200 rounded-xl flex-row justify-between items-center">
      <View className="flex-1 pr-2">
        <Text className="text-sm font-semibold text-red-800">Registration Error</Text>
        <Text className="text-xs text-red-600 mt-0.5">{message}</Text>
      </View>
      <TouchableOpacity onPress={onClose} className="bg-red-100 px-3 py-1.5 rounded-lg">
        <Text className="text-xs font-bold text-red-800">Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}