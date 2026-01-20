'use client';

import { AuthProvider } from '@/context/AuthContext';

export function AuthWrapper({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
