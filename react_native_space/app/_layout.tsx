import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/src/contexts/AuthContext';
import ErrorBoundary from '@/src/components/ErrorBoundary';
import { COLORS } from '@/src/constants/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.bg } }} />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
