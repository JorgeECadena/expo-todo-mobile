import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="w-full bg-white p-6 rounded-2xl shadow-xl">
          <Text className="text-xl font-bold text-gray-800 mb-2">{title}</Text>
          <Text className="text-gray-600 mb-6">{message}</Text>
          
          <View className="flex-row space-x-3 justify-end gap-3">
            <TouchableOpacity 
              onPress={onCancel}
              className="px-4 py-3 rounded-xl bg-gray-100 min-w-[80px] items-center"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onConfirm}
              className="px-4 py-3 rounded-xl bg-red-600 min-w-[80px] items-center"
            >
              <Text className="text-white font-semibold">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}