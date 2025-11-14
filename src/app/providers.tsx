'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import ErrorBoundary from '@/components/ErrorBoundary';
import { MockProvider } from '@/context/MockProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/context/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AuthProvider>
            <MockProvider>
              {children}
            </MockProvider>
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
}