import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../data/datatypes';

interface AuthContextType {
    user: User | null;
    userAuth: boolean;
    authMode: string | null;
    token: string | null;
    updateUser: (newUser: User | null) => void;
    updateUserAuth: (status: boolean) => void;
    updateAuthMode: (mode: string | null) => void;
    setToken: (token: string | null) => void;
    signUp: (email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<boolean>;
    logOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userAuth: false,
    authMode: null,
    token: null,
    updateUser: () => { },
    updateUserAuth: () => { },
    updateAuthMode: () => { },
    setToken: () => { },
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
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const savedToken = localStorage.getItem('authToken');
        
        if (savedUser && savedToken) {
            const parsedUser: User = JSON.parse(savedUser);
            updateUser(parsedUser);
            updateUserAuth(true);
            setToken(savedToken);
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
            const receivedToken: string = data.token;

            updateUser(currentUser);
            updateUserAuth(true);
            setToken(receivedToken);

            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('authToken', receivedToken);
            
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logOut = () => {
        updateUser(null);
        updateUserAuth(false);
        setToken(null);

        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userAuth,
                authMode,
                token,
                updateUser,
                updateUserAuth,
                updateAuthMode,
                setToken,
                signUp,
                signIn,
                logOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
