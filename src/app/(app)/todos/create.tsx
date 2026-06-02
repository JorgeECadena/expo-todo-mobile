import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';

// Service layer imports
import { getAllCategories } from '@/services/categories/categoriesService';
import { createTodo } from '@/services/todos/todosService'; 
import ConfirmationModal from '@/components/confirmationModal';
import CategoryErrorAlert from '@/components/categoryErrorAlert';
import { Category } from '@/types/categories/categories';

// Yup Validation Schema rules
const AtelierSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Title is too short').required('Atelier title is required').trim(),
  description: Yup.string().max(250, 'Description must be under 250 characters').required('Description is required').trim(),
  dueDate: Yup.string().required('Please select a due date'),
  priority: Yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH']).required('Priority is required'),
  categories: Yup.array().min(1, 'Please select at least one category'),
});

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

export default function CreateAtelier() {
  const router = useRouter();
  const formikRef = useRef<any>(null);

  // Layout States
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Fetch available categories for multi-select block
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getAllCategories();
        setAvailableCategories(data || []);
      } catch (err) {
        console.error('Failed to parse categories for atelier multi-select:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handleModalConfirm = () => {
    setConfirmVisible(false);
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header layout row */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Create Atelier</Text>
        <View className="w-8" /> 
      </View>

      <CategoryErrorAlert message={errorMessage} onClose={() => setErrorMessage(null)} />

      <Formik
        innerRef={formikRef}
        initialValues={{
          title: '',
          description: '',
          dueDate: '',
          priority: 'MEDIUM',
          categories: [] as string[], // Holds selected category ID strings array
        }}
        validationSchema={AtelierSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setErrorMessage(null);
          try {
            // 1. Format the date for Java's LocalDateTime (Strip UTC 'Z' and milliseconds)
            const d = new Date(values.dueDate);
            const pad = (n: number) => n.toString().padStart(2, '0');
            // Formats to: YYYY-MM-DDTHH:mm:ss
            const javaCompatibleDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
            // Forward payload downstream to your todo creation endpoint logic
            await createTodo({
              title: values.title,
              description: values.description,
              dueDate: javaCompatibleDate,
              priority: values.priority,
              categories: values.categories,
            });

            resetForm();
            router.back();
          } catch (error: any) {
            const apiError = error?.response?.data?.message || error?.message || 'Failed to submit atelier configuration values.';
            setErrorMessage(apiError);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, setFieldValue, values, errors, touched, isSubmitting }) => (
          <ScrollView 
            className="flex-1 px-6 mt-4" 
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="space-y-5">
              
              {/* Title Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Atelier Title</Text>
                <TextInput
                  className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 font-medium ${touched.title && errors.title ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Design workshop sprint, study session..."
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                />
                {touched.title && errors.title && <Text className="text-xs text-red-500 mt-1">{errors.title}</Text>}
              </View>

              {/* Description Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Description</Text>
                <TextInput
                  className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 h-24 ${touched.description && errors.description ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Provide structured contextual specifications here..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                />
                {touched.description && errors.description && <Text className="text-xs text-red-500 mt-1">{errors.description}</Text>}
              </View>

              {/* Due Date Picker Line */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Due Date</Text>
                
                {/* Conditionally render HTML input for Web */}
                {Platform.OS === 'web' ? (
                  <input 
                    type="date"
                    className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 font-medium ${touched.dueDate && errors.dueDate ? 'border-red-500' : 'border-gray-200'}`}
                    style={{ outline: 'none', fontFamily: 'inherit' }}
                    value={values.dueDate ? new Date(values.dueDate).toISOString().split('T')[0] : ''}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    onChange={(e) => {
                      const dateVal = e.target.value;
                      if (dateVal) {
                        setFieldValue('dueDate', new Date(dateVal).toISOString());
                      }
                    }}
                  />
                ) : (
                  /* Native Mobile Implementation */
                  <>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.7}
                      className={`w-full p-4 border rounded-xl bg-gray-50 flex-row justify-between items-center ${touched.dueDate && errors.dueDate ? 'border-red-500' : 'border-gray-200'}`}
                    >
                      <Text className={`font-medium ${values.dueDate ? 'text-gray-800' : 'text-gray-400'}`}>
                        {values.dueDate ? new Date(values.dueDate).toLocaleDateString() : 'Select target completion deadline'}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#4B5563" />
                    </TouchableOpacity>

                    {showDatePicker && (
                      <View className="mt-2 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <DateTimePicker
                          value={values.dueDate ? new Date(values.dueDate) : new Date()}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          minimumDate={new Date()}
                          textColor="#000000" // CRITICAL FIX: Forces text to be visible even in iOS Dark Mode
                          onChange={(event, selectedDate) => {
                            if (Platform.OS !== 'ios') setShowDatePicker(false);
                            if (selectedDate) {
                              setFieldValue('dueDate', selectedDate.toISOString());
                            }
                          }}
                        />
                        {Platform.OS === 'ios' && (
                          <TouchableOpacity 
                            onPress={() => setShowDatePicker(false)} 
                            className="border-t border-gray-100 bg-gray-50 p-3 items-center"
                          >
                            <Text className="text-base font-bold text-blue-600">Done</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </>
                )}
                {touched.dueDate && errors.dueDate && <Text className="text-xs text-red-500 mt-1">{errors.dueDate}</Text>}
              </View>

              {/* Priority Segment Picker Selection Row */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Priority Level</Text>
                <View className="flex-row bg-gray-100 p-1 rounded-xl gap-1">
                  {PRIORITY_OPTIONS.map((level) => {
                    const isSelected = values.priority === level;
                    return (
                      <TouchableOpacity
                        key={level}
                        onPress={() => setFieldValue('priority', level)}
                        activeOpacity={0.9}
                        className={`flex-1 py-3 rounded-lg items-center ${isSelected ? 'bg-white' : ''}`}
                      >
                        <Text className={`text-xs font-bold ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                          {level}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Multi-Select Categories Container */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Assign Categories (Select multiple)</Text>
                {loadingCategories ? (
                  <ActivityIndicator size="small" color="#2563EB" className="py-2 align-left" />
                ) : availableCategories.length === 0 ? (
                  <Text className="text-xs text-gray-400 italic">No categories created yet. Create one on the dashboard first.</Text>
                ) : (
                  <View className="flex-row flex-wrap gap-2">
                    {availableCategories.map((category) => {
                      const isSelected = values.categories.includes(category.id);
                      return (
                        <TouchableOpacity
                          key={category.id}
                          activeOpacity={0.7}
                          onPress={() => {
                            if (isSelected) {
                              // Remove from state array
                              setFieldValue('categories', values.categories.filter((cid) => cid !== category.id));
                            } else {
                              // Add to state array safely
                              setFieldValue('categories', [...values.categories, category.id]);
                            }
                          }}
                          style={{ borderColor: category.color }}
                          className={`px-3 py-2 border rounded-full flex-row items-center space-x-1.5 gap-1.5 ${isSelected ? 'bg-opacity-10' : 'bg-transparent'}`}
                        >
                          <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                          <Text className="text-xs font-semibold text-gray-700">{category.name}</Text>
                          {isSelected && <Ionicons name="checkmark-circle" size={14} color={category.color} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {touched.categories && errors.categories && <Text className="text-xs text-red-500 mt-1">{errors.categories}</Text>}
              </View>

              {/* Submit Trigger Interceptor Button */}
              <TouchableOpacity
                onPress={() => setConfirmVisible(true)}
                disabled={isSubmitting}
                className={`w-full p-4 rounded-xl items-center justify-center mt-4 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600'}`}
                activeOpacity={0.8}
              >
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Save Atelier</Text>}
              </TouchableOpacity>

            </View>
          </ScrollView>
        )}
      </Formik>

      {/* Reusable confirmation prompt alignment framework */}
      <ConfirmationModal
        visible={confirmVisible}
        title="Create Atelier?"
        message="Are you sure you want to construct this new workspace task assignment?"
        confirmLabel="Save"
        onConfirm={handleModalConfirm}
        onCancel={() => setConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}