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
            setUser(savedUser);
            setUserAuth(true);
        }
    }, []);

    const signUp = (email, username, password) => {
        return true;
    };

    const signIn = (email, password) => {
        const users = [...initialUsers];
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) return false;

        setUser(found);
        setUserAuth(true);
        localStorage.setItem('currentUser', JSON.stringify(found));
        return true;
    };

    const logOut = () => {
        setUser(null);
        setUserAuth(false);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{
            user, userAuth, signUp, signIn, logOut,
            authMode, setAuthMode
        }}>
            {children}
        </AuthContext.Provider>
    );
}