import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';

// Service & Types
import { getTodo, editTodo, deleteTodo } from '@/services/todos/todosService';
// Assuming this is your standard path based on the todosService
import { getAllCategories } from '@/services/categories/categoriesService'; 
import { Todo, EditTodoReq } from '@/types/todos/todos';
import ConfirmationModal from '@/components/confirmationModal';

// Validation Schema
const EditSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Title is too short').required('Required').trim(),
  description: Yup.string().max(250, 'Too long').required('Required').trim(),
  dueDate: Yup.string().required('Required'),
  priority: Yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH']).required('Required'),
});

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

export default function TodoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const formikRef = useRef<any>(null);

  // Screen States
  const [todo, setTodo] = useState<Todo | null>(null);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Centralized Modal State
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDestructive: false,
    onConfirm: () => {},
  });

  // Fetch Todo & Categories on Mount
  useEffect(() => {
    async function fetchScreenData() {
      try {
        const [todoData, categoriesData] = await Promise.all([
          getTodo(id),
          getAllCategories().catch(() => []) // Fallback to empty array if categories fail
        ]);
        setTodo(todoData);
        setAvailableCategories(categoriesData || []);
      } catch (error) {
        console.error('Failed to fetch details:', error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchScreenData();
  }, [id]);

  // --- Modal Action Triggers ---
  
  const promptCancelEdit = () => {
    setModalConfig({
      visible: true,
      title: 'Discard Changes?',
      message: 'Are you sure you want to cancel? Any unsaved edits will be lost.',
      confirmLabel: 'Discard',
      isDestructive: true,
      onConfirm: () => {
        setIsEditing(false);
        closeModal();
      },
    });
  };

  const promptSaveEdit = () => {
    setModalConfig({
      visible: true,
      title: 'Save Changes?',
      message: 'Are you sure you want to update this atelier with the new details?',
      confirmLabel: 'Save',
      isDestructive: false,
      onConfirm: () => {
        if (formikRef.current) formikRef.current.submitForm();
        closeModal();
      },
    });
  };

  const promptDelete = () => {
    setModalConfig({
      visible: true,
      title: 'Delete Atelier?',
      message: 'This action is permanent and cannot be undone.',
      confirmLabel: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        closeModal();
        try {
          await deleteTodo(id);
          router.back();
        } catch (error) {
          console.error('Failed to delete:', error);
        }
      },
    });
  };

  const closeModal = () => setModalConfig((prev) => ({ ...prev, visible: false }));

  // --- Render Handlers ---

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (!todo) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-gray-500 text-base">Atelier not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Safely normalize categories for initial display and form state
  const currentCategoriesArray = Array.isArray(todo.categories) 
    ? todo.categories 
    : (todo.categories ? [todo.categories] : []);
  
  // Extract strictly valid IDs to prevent the 500 error
  const initialCategoryIds = currentCategoriesArray.map((c: any) => c.id).filter(Boolean);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Dynamic Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
        {isEditing ? (
          <>
            <TouchableOpacity onPress={promptCancelEdit} className="p-2">
              <Ionicons name="close" size={28} color="#EF4444" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800">Edit Mode</Text>
            <TouchableOpacity onPress={promptSaveEdit} className="p-2">
              <Ionicons name="checkmark" size={28} color="#22C55E" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800">Atelier Details</Text>
            <TouchableOpacity onPress={() => setIsEditing(true)} className="p-2">
              <MaterialCommunityIcons name="pencil-outline" size={24} color="#2563EB" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={{
          title: todo.title,
          description: todo.description,
          dueDate: todo.dueDate,
          priority: todo.priority,
          completed: todo.completed,
          categories: initialCategoryIds, // Now strictly guaranteed to be an array of string IDs
        }}
        validationSchema={EditSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // Apply strict localized formatting so backend doesn't shift the timezone or crash
            const d = new Date(values.dueDate);
            const pad = (n: number) => n.toString().padStart(2, '0');
            const javaCompatibleDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

            const payload: EditTodoReq = {
              title: values.title,
              description: values.description,
              dueDate: javaCompatibleDate,
              priority: values.priority,
              completed: values.completed,
              categories: values.categories, 
            };

            await editTodo(id, payload);
            
            // Re-fetch to guarantee local state matches DB, then exit edit mode
            const updatedData = await getTodo(id);
            setTodo(updatedData);
            setIsEditing(false);
          } catch (error) {
            console.error('Failed to update todo:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, setFieldValue, values, errors, touched }) => (
          <ScrollView className="flex-1 px-6 mt-4" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            
            {/* Title */}
            <View className="mb-5">
              <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Title</Text>
              {isEditing ? (
                <TextInput
                  className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 font-medium ${touched.title && errors.title ? 'border-red-500' : 'border-gray-200'}`}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                />
              ) : (
                <Text className={`text-2xl font-bold ${values.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {todo.title}
                </Text>
              )}
            </View>

            {/* Status Toggle */}
            <View className="mb-5 flex-row justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <Text className="text-base font-semibold text-gray-700">Status</Text>
              <TouchableOpacity
                disabled={!isEditing}
                onPress={() => setFieldValue('completed', !values.completed)}
                className={`flex-row items-center px-3 py-1.5 rounded-full ${values.completed ? 'bg-green-100' : 'bg-orange-100'}`}
              >
                <Ionicons name={values.completed ? "checkmark-circle" : "time"} size={16} color={values.completed ? "#16A34A" : "#EA580C"} />
                <Text className={`ml-1.5 font-bold text-sm ${values.completed ? 'text-green-700' : 'text-orange-700'}`}>
                  {values.completed ? 'Completed' : 'In Progress'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View className="mb-5">
              <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</Text>
              {isEditing ? (
                <TextInput
                  className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 h-28"
                  multiline
                  textAlignVertical="top"
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                />
              ) : (
                <Text className="text-base text-gray-700 leading-6">{todo.description}</Text>
              )}
            </View>

            {/* Priority & Date Row */}
            <View className="flex-row space-x-4 mb-5 gap-4">
              {/* Priority */}
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Priority</Text>
                {isEditing ? (
                  <View className="bg-gray-100 p-1 rounded-xl">
                    {PRIORITY_OPTIONS.map((level) => (
                      <TouchableOpacity
                        key={level}
                        onPress={() => setFieldValue('priority', level)}
                        className={`py-2 rounded-lg items-center mb-1 ${values.priority === level ? 'bg-white' : ''}`}
                      >
                        <Text className={`text-xs font-bold ${values.priority === level ? 'text-blue-600' : 'text-gray-500'}`}>{level}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 self-start">
                    <Text className="text-blue-700 font-bold">{todo.priority}</Text>
                  </View>
                )}
              </View>

              {/* Due Date */}
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Due Date</Text>
                {isEditing ? (
                  <>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      className="p-4 border border-gray-200 rounded-xl bg-gray-50 items-center justify-center"
                    >
                      <Ionicons name="calendar" size={20} color="#4B5563" />
                      <Text className="text-sm font-medium mt-1 text-gray-700">
                        {new Date(values.dueDate).toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={new Date(values.dueDate)}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          if (Platform.OS !== 'ios') setShowDatePicker(false);
                          if (selectedDate) setFieldValue('dueDate', selectedDate.toISOString());
                        }}
                      />
                    )}
                  </>
                ) : (
                  <View className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 self-start">
                    <Text className="text-gray-700 font-semibold">{new Date(todo.dueDate).toLocaleDateString()}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Dynamic Categories Section */}
            <View className="mb-8">
              <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</Text>
              
              {isEditing ? (
                // Edit Mode: Interactive Multi-Select Tag List
                <View className="flex-row flex-wrap gap-2">
                  {availableCategories.length > 0 ? (
                    availableCategories.map((cat: any) => {
                      const isSelected = values.categories.includes(cat.id);
                      return (
                        <TouchableOpacity
                          key={cat.id}
                          onPress={() => {
                            if (isSelected) {
                              // Remove category
                              setFieldValue('categories', values.categories.filter((id: string) => id !== cat.id));
                            } else {
                              // Add category
                              setFieldValue('categories', [...values.categories, cat.id]);
                            }
                          }}
                          className={`flex-row items-center px-3 py-2 rounded-lg border ${isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}
                        >
                          <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color || '#9CA3AF' }} />
                          <Text className={`text-sm font-bold ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                            {cat.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Text className="text-gray-400 italic">No categories available to select.</Text>
                  )}
                </View>
              ) : (
                // View Mode: Static Tag List
                <View className="flex-row flex-wrap gap-2">
                  {currentCategoriesArray.length > 0 ? (
                    currentCategoriesArray.map((cat: any, index: number) => (
                      <View key={cat.id || index} className="flex-row items-center px-3 py-2 rounded-lg border bg-white" style={{ borderColor: cat.color || '#E5E7EB' }}>
                        <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color || '#9CA3AF' }} />
                        <Text className="text-sm font-bold text-gray-700">{cat.name || 'Unassigned'}</Text>
                      </View>
                    ))
                  ) : (
                    <Text className="text-gray-500 italic">No categories assigned.</Text>
                  )}
                </View>
              )}
            </View>

            {/* Delete Button */}
            {!isEditing && (
              <TouchableOpacity 
                onPress={promptDelete}
                className="mt-2 flex-row items-center justify-center bg-red-50 py-4 rounded-xl border border-red-100"
              >
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
                <Text className="text-red-600 font-bold ml-2 text-base">Delete Atelier</Text>
              </TouchableOpacity>
            )}

          </ScrollView>
        )}
      </Formik>

      {/* The Single Reusable Modal */}
      <ConfirmationModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        isDestructive={modalConfig.isDestructive}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
    </SafeAreaView>
  );
}
