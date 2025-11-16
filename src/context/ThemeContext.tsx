import { create } from 'zustand'

type ThemeState = {
    theme: string;
    updateTheme: (newTheme: string) => void;
    toggleTheme: () => void;
}

export const useTheme = create<ThemeState>()((set, get) => {
    let initialTheme = 'dark';

    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        initialTheme = savedTheme || 'dark';
        document.body.setAttribute('data-theme', initialTheme);
    }

    return {
        theme: initialTheme,

        updateTheme: (newTheme: string) => {
            set({ theme: newTheme });
            document.body.setAttribute('data-theme', newTheme);
            localStorage?.setItem('theme', newTheme);
        },

        toggleTheme: () => {
            const current = get().theme;
            const next = current === 'light' ? 'dark' : 'light';
            get().updateTheme(next);
        },
    };
});
