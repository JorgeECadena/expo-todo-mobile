import React, { useState } from 'react'; // 1. Added useState
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSession } from '@/context/ctx';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuthAlert from '@/components/authAlert'; // 2. Import your reusable component

// Define the validation schema matching Firebase Auth constraints
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .lowercase()
    .required('Email is required')
    .trim(),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function SignIn() {
  const { signIn } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 3. State to store errors

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      {/* Header Text */}
      <View className="mb-8 items-center">
        <Text className="text-3xl font-bold text-gray-800">Welcome Back</Text>
        <Text className="text-gray-500 mt-2">Sign in to your account to continue</Text>
      </View>

      {/* 4. Display the custom alert component if an error occurs */}
      <AuthAlert message={errorMessage} onClose={() => setErrorMessage(null)} />

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setErrorMessage(null); // Clear previous errors before trying again
          
          try {
            // Call the contextual signIn method
            await signIn(values.email, values.password);
          } catch (error: any) {
            // 5. Catch API/Auth errors and update state to display the alert
            const backendError = 'Invalid email or password.';
            setErrorMessage(backendError);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View className="space-y-4">
            
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
            <View className="mb-6">
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
                <Text className="text-white font-bold text-base">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Navigation Button to Create Account */}
            <TouchableOpacity 
              onPress={() => router.push('/sign-up')}
              className="w-full p-4 rounded-xl border border-gray-300 items-center justify-center bg-transparent"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 font-semibold text-base">Create an Account</Text>
            </TouchableOpacity>

          </View>
        )}
      </Formik>
    </View>
  );
}
