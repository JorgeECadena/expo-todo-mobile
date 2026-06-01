import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();

  const mockTodos = [
    { id: 1, title: 'Buy groceries for the week' },
    { id: 2, title: 'Finish the React Native layout' },
    { id: 3, title: 'Go to the gym at 6:00 PM' },
    { id: 4, title: 'Read 10 pages of my book' },
    { id: 5, title: 'Call mom back' },
  ];

  return (
    // 2. Setting edges={['top']} prevents extra bottom padding conflicts with layout routers
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      
      {/* 1. Top Custom Header Layout */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100">
        
        {/* Left Side: Piled books icon + Title */}
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="book-multiple" size={24} color="#2563EB" />
          <Text className="text-2xl font-bold text-gray-900 ml-2">ToDo</Text>
        </View>

        {/* Right Side: Profile icon */}
        <TouchableOpacity 
          onPress={() => router.push('/profile')} 
          activeOpacity={0.7}
          className="p-1"
        >
          <Ionicons name="person-circle-outline" size={32} color="#4B5563" />
        </TouchableOpacity>

      </View>

      {/* 2. Scrollable Body Content */}
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Your Tasks
        </Text>

        {/* The mock tasks list render loop will render completely fine now */}
        {mockTodos.map((todo) => (
          <View 
            key={todo.id} 
            className="p-4 mb-3 bg-gray-50 border border-gray-100 rounded-xl flex-row items-center"
          >
            <View className="w-5 h-5 rounded-md border-2 border-blue-500 mr-3" />
            <Text className="text-base text-gray-700 font-medium">{todo.title}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
