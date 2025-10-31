import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../data/datatypes';

interface AuthContextType {
    user: User | null;
    userAuth: boolean;
    authMode: string | null;
    updateUser: (newUser: User | null) => void;
    updateUserAuth: (status: boolean) => void;
    updateAuthMode: (mode: string | null) => void;
    signUp: (email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<boolean>;
    logOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userAuth: false,
    authMode: null,
    updateUser: () => { },
    updateUserAuth: () => { },
    updateAuthMode: () => { },
    signUp: async () => false,
    signIn: async () => false,
    logOut: () => { }
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

    const signUp = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const currentUser: User = {id: NaN, username: ``, email: email, password: password};

            updateUser(currentUser);
            updateUserAuth(true);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const signIn = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const currentUser: User = data.user;

            updateUser(currentUser);
            updateUserAuth(true);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
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
