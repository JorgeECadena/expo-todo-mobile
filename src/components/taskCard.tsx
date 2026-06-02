import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Todo } from '@/types/todos/todos'; // Adjust this path if needed

interface TaskCardProps {
  todo: Todo;
  onPress?: () => void;
}

export default function TaskCard({ todo, onPress }: TaskCardProps) {
  // Safely handle categories whether the backend returns an array, a single object, or undefined
  const categories = Array.isArray(todo.categories) 
    ? todo.categories 
    : (todo.categories ? [todo.categories] : []);

  // Format the date for a compact card view (e.g., "Oct 12, 2026")
  const formattedDate = new Date(todo.dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      className="p-4 mb-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm"
    >
      {/* Row 1: Categories and Due Date */}
      <View className="flex-row justify-between items-start mb-3">
        
        {/* Left Side: Dynamic Category Tag Pills */}
        <View className="flex-row flex-wrap gap-2 flex-1 mr-2">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <View 
                key={cat.id || index} 
                className="flex-row items-center px-2 py-1 rounded-md border bg-white"
                style={{ borderColor: cat.color || '#E5E7EB' }}
              >
                <View 
                  className="w-2 h-2 rounded-full mr-1.5" 
                  style={{ backgroundColor: cat.color || '#9CA3AF' }} 
                />
                <Text className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  {cat.name || 'Unassigned'}
                </Text>
              </View>
            ))
          ) : (
            <View className="flex-row items-center px-2 py-1 rounded-md border border-gray-200 bg-white">
              <View className="w-2 h-2 rounded-full mr-1.5 bg-gray-300" />
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                No Category
              </Text>
            </View>
          )}
        </View>

        {/* Right Side: Due Date */}
        <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-md">
          <Ionicons name="calendar-outline" size={12} color="#6B7280" />
          <Text className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-wider">
            {formattedDate}
          </Text>
        </View>

      </View>

      {/* Row 2: Task Title and Status */}
      <View className="flex-row items-center">
        <View className={`w-5 h-5 rounded-md border-2 mr-3 justify-center items-center ${todo.completed ? 'border-green-500 bg-green-50' : 'border-blue-500'}`}>
          {todo.completed && <Ionicons name="checkmark" size={12} color="#22C55E" />}
        </View>
        <Text 
          className={`text-base font-semibold flex-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
          numberOfLines={2}
        >
          {todo.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
