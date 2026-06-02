import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Helper function to check if a route is currently active
  const isActive = (route: string) => {
    // If checking index, match either exact "/" or empty string
    if (route === '/') {
      return pathname === '/' || pathname === '/index' || pathname === '';
    }
    return pathname.startsWith(route);
  };

  return (
    <View className="flex-row bg-white border-t border-gray-100 py-3 px-6 justify-around items-center shadow-lg">
      
      {/* Home Tab Button */}
      <TouchableOpacity 
        onPress={() => router.replace('/')} 
        className="items-center justify-center flex-1"
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isActive('/') ? "home" : "home-outline"} 
          size={24} 
          color={isActive('/') ? "#2563EB" : "#9CA3AF"} // Blue if active, Gray if inactive
        />
        <Text 
          className={`text-xs mt-1 font-medium ${
            isActive('/') ? "text-blue-600 font-semibold" : "text-gray-400"
          }`}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Search Tab Button */}
      <TouchableOpacity 
        onPress={() => router.replace('/todos/search')} 
        className="items-center justify-center flex-1"
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isActive('/todos/search') ? "search" : "search-outline"} 
          size={24} 
          color={isActive('/todos/search') ? "#2563EB" : "#9CA3AF"} // Blue if active, Gray if inactive
        />
        <Text 
          className={`text-xs mt-1 font-medium ${
            isActive('/todos/search') ? "text-blue-600 font-semibold" : "text-gray-400"
          }`}
        >
          Search
        </Text>
      </TouchableOpacity>

    </View>
  );
}
