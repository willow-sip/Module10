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
    }, []);

    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

    const signUp = (email, username, password) => {
        const users = getUsers();
        const exists = users.find(u => u.email === email);
        if (exists) return false;

        const newUser = {
            email,
            password,
            name: username,
            bio: '',
            avatar: '',
            recPeople: [],
            recCommunities: []
        };

        const updatedUsers = [...users, newUser];
        saveUsers(updatedUsers);
        setUser(newUser);
        setUserAuth(true);
        return true;
    };

    const signIn = (email, password) => {
        const users = getUsers();
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) return false;

        setUser(found);
        setUserAuth(true);
        return true;
    };

    const logOut = () => {
        setUser(null);
        setUserAuth(false);
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

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