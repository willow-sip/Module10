'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import UnauthorizedPage from '@/components/UnauthorizedPage';

export default function Unauthorized() {
    return (
        <div className="app">
            <Header />
            <UnauthorizedPage />
            <Footer />
        </div>
    )
}
