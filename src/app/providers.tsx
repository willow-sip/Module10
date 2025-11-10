'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { MSWProvider } from '@/context/MswContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <MSWProvider>
              {children}
            </MSWProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
}