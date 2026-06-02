import "@/global.css";
import { Stack } from 'expo-router';

import { SessionProvider } from '@/context/ctx';
import { SplashScreenController } from '@/splash';

export default function Root() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  // We don't need to check the session here because (app)/_layout.tsx 
  // handles the protection and redirects automatically.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
