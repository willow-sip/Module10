import { createContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/users';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userAuth, setUserAuth] = useState(false);
    const [authMode, setAuthMode] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (savedUser) {
            updateUser(savedUser);
            updateUserAuth(true);
        }
    }, []);

    const updateUser = (newUser) => {
        setUser(newUser);
    };

    const updateUserAuth = (status) => {
        setUserAuth(status);
    };

    const updateAuthMode = (mode) => {
        setAuthMode(mode);
    };

    const signUp = (email, username, password) => {
        return true;
    };

    const signIn = (email, password) => {
        const users = [...initialUsers];
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) return false;

        updateUser(found);
        updateUserAuth(true);
        localStorage.setItem('currentUser', JSON.stringify(found));
        return true;
    };

    const logOut = () => {
        updateUser(null);
        updateUserAuth(false);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{
            user, userAuth, authMode,
            updateUser, updateUserAuth, updateAuthMode,
            signUp, signIn, logOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};
