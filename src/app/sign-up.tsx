import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useSession } from '@/context/ctx';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { signUp } from '@/services/auth/authService';
import AuthAlert from '@/components/authAlert'; // Adjust path based on your setup

// Validation schema matching constraints and handling confirmations
const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .required('Name is required')
    .trim(),
  email: Yup.string()
    .email('Invalid email address')
    .lowercase()
    .required('Email is required')
    .trim(),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SignUp() {
  const { signIn } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <ScrollView 
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Text */}
      <View className="mb-6 items-center mt-8">
        <Text className="text-3xl font-bold text-gray-800">Create Account</Text>
        <Text className="text-gray-500 mt-2">Sign up to get started today</Text>
      </View>

      {/* Reusable Custom Alert Component */}
      <AuthAlert message={errorMessage} onClose={() => setErrorMessage(null)} />

      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={SignUpSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setErrorMessage(null); // Reset previous errors
          
          try {
            // 1. Call your sign up service mapped to CreateUserReq
            await signUp({
              name: values.name,
              email: values.email,
              password: values.password,
              role: 'user', // Default backend role requirement
            });

            // 2. Since sign up succeeded, immediately sign the user in
            await signIn(values.email, values.password);
            
          } catch (error: any) {
            // 3. Fallback error message if backend registration fails
            const backendError = error?.response?.data?.message || error?.message || 'Something went wrong during registration.';
            setErrorMessage(backendError);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View className="space-y-4 mb-8">
            
            {/* Name Field */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-1">Full Name</Text>
              <TextInput
                className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 ${
                  touched.name && errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {touched.name && errors.name && (
                <Text className="text-xs text-red-500 mt-1 font-medium">{errors.name}</Text>
              )}
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-1">Email Address</Text>
              <TextInput
                className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 ${
                  touched.email && errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="example@domain.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text className="text-xs text-red-500 mt-1 font-medium">{errors.email}</Text>
              )}
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-1">Password</Text>
              <TextInput
                className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 ${
                  touched.password && errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              {touched.password && errors.password && (
                <Text className="text-xs text-red-500 mt-1 font-medium">{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Field */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-1">Confirm Password</Text>
              <TextInput
                className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-800 ${
                  touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
              className={`w-full p-4 rounded-xl items-center justify-center mb-4 ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600'
              }`}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login Option */}
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-full p-4 items-center justify-center bg-transparent"
              activeOpacity={0.7}
            >
              <Text className="text-blue-600 font-semibold text-sm">Already have an account? Sign In</Text>
            </TouchableOpacity>

          </View>
        )}
      </Formik>
    </ScrollView>
  );
}