import { create } from 'zustand'

type ThemeState = {
    theme: string;
    updateTheme: (newTheme: string) => void;
    toggleTheme: () => void;
}

export const useTheme = create<ThemeState>()((set, get) => {
    return {
        theme: 'dark',

        updateTheme: (newTheme: string) => {
            set({ theme: newTheme });
            if (typeof window !== 'undefined') {
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            }
        },

        toggleTheme: () => {
            const current = get().theme;
            const next = current === 'light' ? 'dark' : 'light';
            get().updateTheme(next);
        },
    };
});
