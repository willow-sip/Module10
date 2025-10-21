import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

export const AppProviders = ({ children }) => (
    <AuthProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </AuthProvider>
);
