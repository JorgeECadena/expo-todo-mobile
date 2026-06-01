import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/ctx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ConfirmationModal from '@/components/confirmationModal';
// Import your service (assuming the default export name is getProfile)
import { getProfile } from '@/services/profile/profileService'; 

interface UserProfileData {
  name: string;
  email: string;
}

export default function Profile() {
  const { signOut } = useSession();
  const router = useRouter();
  
  // State variables
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Fetch data on mount
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const data = await getProfile();
        setUserData(data);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      
      {/* 1. Header Navigation Bar Row */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <Text className="text-lg font-bold text-gray-800">My profile</Text>
        
        {/* Empty placeholder view to balance out the flex centering layout */}
        <View className="w-8" />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <View className="flex-1 justify-between px-6 py-6">
          
          {/* 2. Profile Details Rows */}
          <View className="space-y-4">
            
            {/* Row 1: Profile Image Wrapper Placeholder */}
            <View className="bg-white p-4 rounded-xl border border-gray-100 items-center justify-center mb-2">
              <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center">
                <Ionicons name="person" size={40} color="#2563EB" />
              </View>
              <Text className="text-xs font-semibold text-blue-600 mt-2">Change Avatar</Text>
            </View>

            {/* Row 2: User Name Entry */}
            <View className="bg-white p-4 rounded-xl border border-gray-100 flex-row justify-between items-center mb-3">
              <Text className="text-sm font-medium text-gray-400">Name</Text>
              <Text className="text-base font-semibold text-gray-800">{userData?.name || 'N/A'}</Text>
            </View>

            {/* Row 3: User Email Entry */}
            <View className="bg-white p-4 rounded-xl border border-gray-100 flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-400">Email Address</Text>
              <Text className="text-base font-semibold text-gray-800">{userData?.email || 'N/A'}</Text>
            </View>

          </View>

          {/* 3. Bottom Action Area Container */}
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            className="w-full p-4 bg-red-50 border border-red-100 rounded-xl items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-red-600 font-bold text-base">Sign Out</Text>
          </TouchableOpacity>

        </View>
      )}

      {/* 4. Overlay Sign-out Validation Interceptor Modal */}
      <ConfirmationModal
        visible={modalVisible}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        isDestructive={true} // Turns the button red
        onConfirm={() => {
          setModalVisible(true);
          signOut();
        }}
        onCancel={() => setModalVisible(false)}
      />

    </SafeAreaView>
  );
}
