import React, { useState, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createCategory } from '@/services/categories/categoriesService';
import CategoryErrorAlert from '@/components/categoryErrorAlert';
import ConfirmationModal from '@/components/confirmationModal'; 

const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(25, 'Name is too long')
    .required('Category name is required')
    .trim(),
  description: Yup.string()
    .max(150, 'Description must be under 150 characters')
    .required('Description is required')
    .trim(),
  color: Yup.string().required('Please select a color representation'),
});

// A clean palette of modern application UI colors
const COLOR_PALETTE = [
  '#2563EB', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#64748B', // Slate
];

export default function CreateCategory() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  
  const formikRef = useRef<any>(null);

  const handleModalConfirm = () => {
    setConfirmVisible(false);
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header row */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Create category</Text>
        <View className="w-8" />
      </View>

      <CategoryErrorAlert message={errorMessage} onClose={() => setErrorMessage(null)} />

      <Formik
        innerRef={formikRef}
        initialValues={{ name: '', description: '', color: COLOR_PALETTE[0] }} // Default to first color
        validationSchema={CategorySchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setErrorMessage(null);
          try {
            await createCategory({
              name: values.name,
              description: values.description,
              color: values.color,
            });
            
            resetForm();
            router.back();
          } catch (error: any) {
            const apiError = error?.response?.data?.message || error?.message || 'Failed to submit the category request.';
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
              
              {/* Category Name Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Category Name</Text>
                <TextInput
                  className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 ${
                    touched.name && errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Work, Study, Personal..."
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {touched.name && errors.name && (
                  <Text className="text-xs text-red-500 mt-1 font-medium">{errors.name}</Text>
                )}
              </View>

              {/* Description Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Description</Text>
                <TextInput
                  className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 h-24 ${
                    touched.description && errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Write a brief description..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                />
                {touched.description && errors.description && (
                  <Text className="text-xs text-red-500 mt-1 font-medium">{errors.description}</Text>
                )}
              </View>

              {/* Grid Color Selection Box */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-sm font-semibold text-gray-700">Select Category Color</Text>
                  
                  <View className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-lg gap-2">
                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: values.color }} />
                    <Text className="text-xs font-mono font-bold text-gray-600 uppercase">{values.color}</Text>
                  </View>
                </View>

                {/* Color Swatch Grid */}
                <View className="flex-row flex-wrap justify-between p-2 bg-gray-50 border border-gray-100 rounded-2xl">
                  {COLOR_PALETTE.map((hexColor) => {
                    const isSelected = values.color === hexColor;
                    return (
                      <TouchableOpacity
                        key={hexColor}
                        onPress={() => setFieldValue('color', hexColor)}
                        activeOpacity={0.7}
                        className="p-2"
                      >
                        <View 
                          className="w-10 h-10 rounded-full items-center justify-center relative shadow-sm"
                          style={{ backgroundColor: hexColor }}
                        >
                          {/* Show a checkmark if this specific color swatch is selected */}
                          {isSelected && (
                            <Ionicons name="checkmark" size={20} color="white" />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {touched.color && errors.color && (
                  <Text className="text-xs text-red-500 mt-1 font-medium">{errors.color}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={() => setConfirmVisible(true)}
                disabled={isSubmitting}
                className={`w-full p-4 rounded-xl items-center justify-center mt-4 ${
                  isSubmitting ? 'bg-blue-400' : 'bg-blue-600'
                }`}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">Save Category</Text>
                )}
              </TouchableOpacity>

            </View>
          </ScrollView>
        )}
      </Formik>

      {/* Confirmation Modal layout */}
      <ConfirmationModal
        visible={confirmVisible}
        title="Create Category?"
        message="Are you sure you want to save this category with the selected theme color?"
        confirmLabel="Save" // Changes button text to Save
        onConfirm={handleModalConfirm}
        onCancel={() => setConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}