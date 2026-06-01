import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

// 1. Added deleteCategory to service imports
import { getCategory, editCategory, deleteCategory } from '@/services/categories/categoriesService';
import ConfirmationModal from '@/components/confirmationModal';
import CategoryErrorAlert from '@/components/categoryErrorAlert';

const CategorySchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too short').max(25, 'Too long').required('Category name required').trim(),
  description: Yup.string().max(150, 'Max 150 characters').required('Description required').trim(),
  color: Yup.string().required('Color is required'),
});

const COLOR_PALETTE = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#14B8A6', '#64748B'];

export default function CategoryDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [categoryData, setCategoryData] = useState<{ name: string; description: string; color: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false); // Tracks button loading state during API request

  // 2. Expanded state types to support 'delete'
  const [modalType, setModalType] = useState<'save' | 'cancel' | 'delete' | null>(null);
  const formikRef = useRef<any>(null);

  useEffect(() => {
    async function loadCategoryDetails() {
      try {
        if (!id) return;
        const data = await getCategory(id);
        setCategoryData(data);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to pull requested category properties.');
      } finally {
        setLoading(false);
      }
    }
    loadCategoryDetails();
  }, [id]);

  // 3. Updated handler to intercept and run the deletion script
  const handleModalConfirm = async () => {
    const currentType = modalType;
    setModalType(null); // Clear modal instantly

    if (currentType === 'cancel') {
      setIsEditing(false);
    } else if (currentType === 'save') {
      if (formikRef.current) formikRef.current.submitForm();
    } else if (currentType === 'delete') {
      setErrorMessage(null);
      setDeleting(true);
      try {
        await deleteCategory(id!);
        router.back(); // Redirect on success
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to delete the category.');
        setDeleting(false);
      }
    }
  };

  // Helper config to dynamically supply modal content props cleanly
  const getModalContent = () => {
    if (modalType === 'cancel') {
      return {
        title: 'Discard Adjustments?',
        message: 'Are you sure you want to exit editing mode? All modified configurations will be lost.',
        confirmLabel: 'Discard',
        isDestructive: true,
      };
    }
    if (modalType === 'delete') {
      return {
        title: 'Delete Category?',
        message: 'Are you sure you want to permanently delete this category? This action cannot be undone.',
        confirmLabel: 'Delete',
        isDestructive: true,
      };
    }
    return {
      title: 'Apply Updates?',
      message: 'Are you sure you want to save the new information changes to this category database model?',
      confirmLabel: 'Save Changes',
      isDestructive: false,
    };
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={{
          name: categoryData?.name || '',
          description: categoryData?.description || '',
          color: categoryData?.color || COLOR_PALETTE[0],
        }}
        validationSchema={CategorySchema}
        onSubmit={async (values, { setSubmitting }) => {
          setErrorMessage(null);
          try {
            await editCategory(id!, {
              name: values.name,
              description: values.description,
              color: values.color,
            });
            setCategoryData(values);
            setIsEditing(false);
          } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || err?.message || 'Error updating data.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, setFieldValue, values, errors, touched, isSubmitting }) => (
          <View className="flex-1">
            
            {/* Dynamic Header Actions Row */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
              {isEditing ? (
                <>
                  <TouchableOpacity onPress={() => setModalType('cancel')} className="p-1">
                    <Ionicons name="close" size={26} color="#4B5563" />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-gray-800">Editing category</Text>
                  <TouchableOpacity onPress={() => setModalType('save')} disabled={isSubmitting} className="p-1">
                    {isSubmitting ? <ActivityIndicator size="small" color="#2563EB" /> : <Ionicons name="checkmark" size={26} color="#2563EB" />}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-gray-800">Category Detail</Text>
                  <TouchableOpacity onPress={() => setIsEditing(true)} className="p-1" disabled={deleting}>
                    <Ionicons name="create-outline" size={24} color={deleting ? '#D1D5DB' : '#4B5563'} />
                  </TouchableOpacity>
                </>
              )}
            </View>

            <CategoryErrorAlert message={errorMessage} onClose={() => setErrorMessage(null)} />

            {/* Main Details Wrapper Container */}
            <ScrollView className="flex-1 px-6 mt-4" contentContainerStyle={{ paddingBottom: 40 }}>
              
              {/* Category Name Block */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Category Name</Text>
                {isEditing ? (
                  <TextInput
                    className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 font-medium ${touched.name && errors.name ? 'border-red-500' : 'border-gray-200'}`}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                ) : (
                  <View className="flex-row items-center pt-1">
                    <View className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: categoryData?.color }} />
                    <Text className="text-xl font-bold text-gray-900">{categoryData?.name}</Text>
                  </View>
                )}
                {isEditing && touched.name && errors.name && <Text className="text-xs text-red-500 mt-1">{errors.name}</Text>}
              </View>

              {/* Description Block */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</Text>
                {isEditing ? (
                  <TextInput
                    className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 h-24 ${touched.description && errors.description ? 'border-red-500' : 'border-gray-200'}`}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />
                ) : (
                  <Text className="text-base text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-1 leading-6">{categoryData?.description || 'No description provided.'}</Text>
                )}
                {isEditing && touched.description && errors.description && <Text className="text-xs text-red-500 mt-1">{errors.description}</Text>}
              </View>

              {/* Color Grid Module */}
              {isEditing && (
                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-sm font-semibold text-gray-700">Update Swatch Mapping</Text>
                    <View className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-lg gap-2">
                      <View className="w-3 h-3 rounded-full" style={{ backgroundColor: values.color }} />
                      <Text className="text-xs font-mono font-bold text-gray-600 uppercase">{values.color}</Text>
                    </View>
                  </View>

                  <View className="flex-row flex-wrap justify-between p-2 bg-gray-50 border border-gray-100 rounded-2xl">
                    {COLOR_PALETTE.map((hexColor) => {
                      const isSelected = values.color === hexColor;
                      return (
                        <TouchableOpacity key={hexColor} onPress={() => setFieldValue('color', hexColor)} activeOpacity={0.7} className="p-2">
                          <View className="w-10 h-10 rounded-full items-center justify-center relative shadow-sm" style={{ backgroundColor: hexColor }}>
                            {isSelected && <Ionicons name="checkmark" size={20} color="white" />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* 4. Delete Action Button Row (Hidden during active editing mode) */}
              {!isEditing && (
                <TouchableOpacity
                  onPress={() => setModalType('delete')}
                  disabled={deleting}
                  className="w-full mt-6 p-4 rounded-xl border border-red-200 bg-red-50/50 flex-row items-center justify-center space-x-2 gap-2 active:bg-red-50"
                  activeOpacity={0.6}
                >
                  {deleting ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                  ) : (
                    <>
                      <Ionicons name="trash-outline" size={18} color="#DC2626" />
                      <Text className="text-red-600 font-bold text-base">Delete Category</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

            </ScrollView>

            {/* Reusable Confirmation Modal bound to helper configs */}
            <ConfirmationModal
              visible={modalType !== null}
              title={getModalContent().title}
              message={getModalContent().message}
              confirmLabel={getModalContent().confirmLabel}
              isDestructive={getModalContent().isDestructive}
              onConfirm={handleModalConfirm}
              onCancel={() => setModalType(null)}
            />

          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}