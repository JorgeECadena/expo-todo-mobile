import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;     // Custom text for the action button
  cancelLabel?: string;      // Custom text for the dismiss button
  isDestructive?: boolean;   // Changes button style (Red for signout/delete, Blue for creation)
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",    // Fallback default
  cancelLabel = "Cancel",      // Fallback default
  isDestructive = false,       // Default to constructive (blue) action
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="w-full bg-white p-6 rounded-2xl shadow-xl max-w-sm">
          <Text className="text-xl font-bold text-gray-800 mb-2">{title}</Text>
          <Text className="text-gray-600 mb-6">{message}</Text>
          
          <View className="flex-row space-x-3 justify-end gap-3">
            {/* Cancel Button */}
            <TouchableOpacity 
              onPress={onCancel}
              className="px-4 py-3 rounded-xl bg-gray-100 min-w-[85px] items-center"
            >
              <Text className="text-gray-700 font-semibold">{cancelLabel}</Text>
            </TouchableOpacity>

            {/* Dynamic Confirm Action Button */}
            <TouchableOpacity 
              onPress={onConfirm}
              className={`px-4 py-3 rounded-xl min-w-[85px] items-center ${
                isDestructive ? 'bg-red-600' : 'bg-blue-600'
              }`}
            >
              <Text className="text-white font-semibold">{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
