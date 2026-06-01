import { use, createContext, type PropsWithChildren, useCallback } from 'react';
import { useStorageState } from '@/hooks/useStorageState';
import { login, logout } from '@/services/auth/authService';
import { router } from 'expo-router';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
} | null>(null);

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: useCallback( async (email: string, password: string) => {
          const token = await login(email, password);
          setSession(token);
          router.replace("/(app)");
        }, []),
        signOut: () => {
          logout();
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
