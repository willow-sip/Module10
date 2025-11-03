import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../data/datatypes';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setExpiresAt, clearExpiresAt } from '../slices/authSlice';

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

function getTokenExpiration(token: string): number | null {
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        return payload.exp ? payload.exp * 1000 : null;
    } catch (error) {
        console.error('Error in token decifer:', error);
        return null;
    }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [userAuth, setUserAuth] = useState<boolean>(false);
    const [authMode, setAuthMode] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const dispatch = useDispatch();
    const expiresAt = useSelector((state: RootState) => state.auth.expiresAt);

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const savedToken = localStorage.getItem('authToken');
        
        if (savedUser && savedToken) {
            const parsedUser: User = JSON.parse(savedUser);
            const exp = getTokenExpiration(savedToken);

            if (exp && Date.now() < exp) {
                updateUser(parsedUser);
                updateUserAuth(true);
                setToken(savedToken);
                dispatch(setExpiresAt(exp));
            } else {
                logOut();
            }
        }
    }, []);

    useEffect(() => {
        if (expiresAt) {
            const now = Date.now();
            const timeout = expiresAt - now;

            if (timeout <= 0) {
                logOut();
                dispatch(clearExpiresAt());
            } else {
                const timer = setTimeout(() => {
                    logOut();
                    dispatch(clearExpiresAt());
                }, timeout);

                return () => clearTimeout(timer);
            }
        }
    }, [expiresAt]);

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
            const exp = getTokenExpiration(receivedToken);
            
            if (!exp) throw new Error('No exp field in token object');

            updateUser(currentUser);
            updateUserAuth(true);
            setToken(receivedToken);
            dispatch(setExpiresAt(exp));

            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('authToken', receivedToken);
            localStorage.setItem('expiresAt', exp.toString());
            
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
        dispatch(clearExpiresAt());

        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('expiresAt');
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
