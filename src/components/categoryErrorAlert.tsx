import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

interface CategoryErrorAlertProps {
  message: string | null;
  onClose: () => void;
}

export default function CategoryErrorAlert({ message, onClose }: CategoryErrorAlertProps) {
  if (!message) return null;

  return (
    <View className="w-full p-4 mb-4 bg-amber-50 border border-amber-200 rounded-xl flex-row justify-between items-center mx-6 max-w-[90%] self-center">
      <View className="flex-1 pr-2">
        <Text className="text-sm font-semibold text-amber-800">Could not save category</Text>
        <Text className="text-xs text-amber-600 mt-0.5">{message}</Text>
      </View>
      <TouchableOpacity onPress={onClose} className="bg-amber-100 px-3 py-1.5 rounded-lg">
        <Text className="text-xs font-bold text-amber-800">Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}