import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Services & Components
import { searchTodo } from '@/services/todos/todosService';
import TaskCard from '@/components/taskCard'; // Adjust path if needed
import { Todo } from '@/types/todos/todos';

export default function Search() {
  const router = useRouter();

  // Screen States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [results, setResults] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // 1. Debounce Effect: Updates the actual query string 500ms after the user stops typing
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    // Cleanup function cancels the timeout if the user types again before 500ms
    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  // 2. Fetch Effect: Triggers the API call whenever the debounced query changes
  useEffect(() => {
    async function fetchSearchResults() {
      // If the search bar is cleared, reset everything
      if (!debouncedQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchTodo(debouncedQuery);
        setResults(data || []);
        setHasSearched(true);
      } catch (error) {
        console.error('Failed to search todos:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [debouncedQuery]);

  // --- Render Handlers ---

  const renderEmptyState = () => {
    if (isLoading) return null;
    
    // Only show the "Oops" message if a search has actually occurred and yielded no results
    if (hasSearched && results.length === 0) {
      return (
        <View className="flex-1 justify-center items-center mt-20">
          <Ionicons name="search-outline" size={48} color="#D1D5DB" />
          <Text className="text-gray-500 text-lg font-medium mt-4">
            Oops, nothing was found!
          </Text>
        </View>
      );
    }

    // Default state before any search happens
    return (
      <View className="flex-1 justify-center items-center mt-20">
        <Text className="text-gray-400 text-base">
          Type above to search your ateliers...
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      
      {/* Header & Search Bar */}
      <View className="px-4 py-3 border-b border-gray-100 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800 h-10"
            placeholder="Search ateliers..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {/* Clear button if there is text */}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View className="py-6">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      )}

      {/* Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <TaskCard 
            todo={item} 
            // Navigate to your previously built detail screen
            // Adjust this route to match your expo-router file structure!
            onPress={() => router.push(`/todos/${item.id}`)} 
          />
        )}
      />
      
    </SafeAreaView>
  );
}