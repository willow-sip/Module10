'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationContextClass } from '@/context/NotificationContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { MSWProvider } from '@/context/MswContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AuthProvider>
          <NotificationContextClass>
            <ThemeProvider>
              <MSWProvider>
                {children}
              </MSWProvider>
            </ThemeProvider>
          </NotificationContextClass>
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
}