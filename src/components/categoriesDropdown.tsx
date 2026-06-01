import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllCategories } from '@/services/categories/categoriesService';

interface Category {
  id: string | number;
  name: string;
  color: string;
}

export default function CategoriesDropdown() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesExpanded, setCategoriesExpanded] = useState<boolean>(false);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <View className="mx-6 mt-4 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
      {/* Clickable Header Row */}
      <TouchableOpacity 
        onPress={() => setCategoriesExpanded(!categoriesExpanded)}
        activeOpacity={0.8}
        className="p-4 flex-row justify-between items-center bg-gray-50"
      >
        <View className="flex-row items-center">
          <Ionicons name="folder-open-outline" size={20} color="#4B5563" />
          <Text className="text-base font-bold text-gray-800 ml-2">Your categories</Text>
        </View>
        <Ionicons 
          name={categoriesExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#4B5563" 
        />
      </TouchableOpacity>

      {/* Expanded Content Panel */}
      {categoriesExpanded && (
        <View className="px-4 pb-4 border-t border-gray-100 bg-white">
          
          {/* Create Category Button */}
          <TouchableOpacity 
            onPress={() => router.push('/categories/create')}
            className="flex-row items-center py-3 mb-2 border-b border-gray-50"
            activeOpacity={0.6}
          >
            <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
            <Text className="text-sm font-semibold text-blue-600 ml-2">Create new category</Text>
          </TouchableOpacity>

          {/* Categories List */}
          {loadingCategories ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : (
            <View className="space-y-1">
              {categories.map((category) => (
                <View key={category.id} className="flex-row items-center py-2 px-1">
                  <View 
                    className="w-1 h-5 rounded-full mr-3" 
                    style={{ backgroundColor: category.color || '#9CA3AF' }} 
                  />
                  <Text className="text-sm text-gray-700 font-medium">{category.name}</Text>
                </View>
              ))}
            </View>
          )}

        </View>
      )}
    </View>
  );
}