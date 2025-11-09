'use client';
import Profile from '@/components/Profile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

export default function ProfilePage() {
    const { user, userAuth } = useContext(AuthContext);
    return (
        <div className="app">
            <Header name={`${user?.firstName} ${user?.secondName}`} avatar={user?.profileImage} />
            <Profile />
            <Footer />
        </div>
    )
}

