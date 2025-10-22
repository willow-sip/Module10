import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

interface AppProvidersProps {
    children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
    <AuthProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </AuthProvider>
);
