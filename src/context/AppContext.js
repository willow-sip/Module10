import { createContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/users';

export const AppContext = createContext();


export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userAuth, setUserAuth] = useState(false);
    const [authMode, setAuthMode] = useState(null);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users'));
        if (!storedUsers || storedUsers.length === 0) {
            localStorage.setItem('users', JSON.stringify(initialUsers));
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.setAttribute('data-theme', savedTheme);
        }

        const savedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (savedUser) {
            setUser(savedUser);
            setUserAuth(true);
        }
    }, []);

    const getUsers = () => [...initialUsers];

    const signUp = (email, username, password) => {
        return true;
    };

    const signIn = (email, password) => {
        const users = getUsers();
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

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            document.body.setAttribute('data-theme', newTheme);
            return newTheme;
        });
    };

    return (
        <AppContext.Provider value={{
            user, userAuth, theme,
            toggleTheme, signUp, signIn, logOut,
            authMode, setAuthMode
        }}>
            {children}
        </AppContext.Provider>
    );
};