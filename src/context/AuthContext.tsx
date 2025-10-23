import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { initialUser, User } from '../data/users';

interface AuthContextType {
    user: User | null;
    userAuth: boolean;
    authMode: string | null;
    updateUser: (newUser: User | null) => void;
    updateUserAuth: (status: boolean) => void;
    updateAuthMode: (mode: string | null) => void;
    signUp: (email: string, username: string, password: string) => boolean;
    signIn: (email: string, password: string) => boolean;
    logOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userAuth: false,
    authMode: null,
    updateUser: () => { },
    updateUserAuth: () => { },
    updateAuthMode: () => { },
    signUp: () => false,
    signIn: () => false,
    logOut: () => { }
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userAuth, setUserAuth] = useState<boolean>(false);
    const [authMode, setAuthMode] = useState<string | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const parsedUser: User = JSON.parse(savedUser);
            updateUser(parsedUser);
            updateUserAuth(true);
        }
    }, []);

    const updateUser = (newUser: User | null) => setUser(newUser);
    const updateUserAuth = (status: boolean) => setUserAuth(status);
    const updateAuthMode = (mode: string | null) => setAuthMode(mode);

    const signUp = (email: string, username: string, password: string): boolean => {
        return true;
    };

    const signIn = (email: string, password: string): boolean => {
        //const found = someUsersArray.find(u => u.email === email && u.password === password);
        //if (!found) return false;

        if (email === initialUser.email && password === initialUser.password) {
            updateUser(initialUser);
            updateUserAuth(true);
            localStorage.setItem('currentUser', JSON.stringify(initialUser));
            return true;
        }
        return false;
    };

    const logOut = () => {
        updateUser(null);
        updateUserAuth(false);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userAuth,
                authMode,
                updateUser,
                updateUserAuth,
                updateAuthMode,
                signUp,
                signIn,
                logOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
