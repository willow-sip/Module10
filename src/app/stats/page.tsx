'use client';
import Stats from '@/components/Stats';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function StatsPage() {
    const { user, userAuth } = useContext(AuthContext);
    return (
        <div className="app">
            <Header name={`${user?.firstName} ${user?.secondName}`} avatar={user?.profileImage} />
            <Stats />
            <Footer />
        </div>
    )
}

