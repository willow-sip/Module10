import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
    theme: string;
    updateTheme: (newTheme: string) => void;
    toggleTheme: () => void;
}

export const ThemeContext = createContext < ThemeContextType > ({
    theme: 'dark',
    updateTheme: () => { },
    toggleTheme: () => { }
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState < string > ('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            updateTheme(savedTheme);
        }
    }, []);

    const updateTheme = (newTheme: string) => {
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const toggleTheme = () => {
        updateTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
