'use client';
import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { MoonLoader } from 'react-spinners';

const Stats = lazy(() => import('@/components/Stats'));

export default function StatsPage() {
    const { user, userAuth } = useContext(AuthContext);
    return (
        <div className="app">
            <Header name={`${user?.firstName} ${user?.secondName}`} avatar={user?.profileImage} />
            <Suspense fallback={<MoonLoader style={{ 'margin': '0 auto' }} />}>
                <Stats />
            </Suspense>
            <Footer />
        </div>
    )
}

