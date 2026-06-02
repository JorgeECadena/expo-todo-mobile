import { Slot, Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useSession } from '@/context/ctx';
import BottomNavBar from '@/components/bottomNavBar';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // Show a loading spinner while checking the session token
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Only protect the routes if session doesn't exist
  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View className="flex-1 bg-white">
      {/* The Slot component renders whichever screen is active (index, search, me, etc.) */}
      <View className="flex-1">
        <Slot />
      </View>
      
      {/* This renders the persistent bottom navigation bar below the screen content */}
      <BottomNavBar />
    </View>
  );
}