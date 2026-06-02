import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Modular Component Imports
import CategoriesDropdown from '@/components/categoriesDropdown';
import TaskCard from '@/components/taskCard'; // New import!

// Target Data Layer Imports
import { getAllTodos } from '@/services/todos/todosService';
import { Todo } from '@/types/todos/todos';

export default function Index() {
  const router = useRouter();

  // State Management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch real database items on mount
  useEffect(() => {
    async function fetchTodos() {
      try {
        const data = await getAllTodos();
        setTodos(data || []);
      } catch (error) {
        console.error('Failed to fetch todo list items:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTodos();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white relative" edges={['top']}>
      
      {/* 1. Header Navigation */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="book-multiple" size={24} color="#2563EB" />
          <Text className="text-2xl font-bold text-gray-900 ml-2">ToDo</Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.7} className="p-1">
          <Ionicons name="person-circle-outline" size={32} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {/* 2. Isolated Categories Module */}
        <CategoriesDropdown />

        {/* 3. Dynamic Todo Body List Block */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : todos.length === 0 ? (
          /* Empty State View Option */
          <View className="flex-1 justify-center items-center px-8 text-center pb-12">
            <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4">
              <MaterialCommunityIcons name="clipboard-text-outline" size={32} color="#2563EB" />
            </View>
            <Text className="text-gray-500 text-center text-base font-medium mb-6 leading-6">
              Oops, it seems like you don't have any ateliers created yet!
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/todos/create')}
              activeOpacity={0.8}
              className="bg-blue-600 px-6 py-3.5 rounded-xl flex-row items-center space-x-2 gap-2 shadow-sm"
            >
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text className="text-white font-bold text-sm">Create New Atelier</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Populated List Content Option */
          <ScrollView 
            className="flex-1 px-6"
            contentContainerStyle={{ paddingVertical: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Your Tasks
            </Text>

            {todos.map((todo) => (
              <TaskCard 
                key={todo.id} 
                todo={todo} 
                onPress={() => router.push(`/todos/${todo.id}`)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* 4. Floating Action Button (FAB) */}
      <TouchableOpacity
        onPress={() => router.push('/todos/create')}
        activeOpacity={0.8}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg elevation-5"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}