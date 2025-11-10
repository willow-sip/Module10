'use client';
import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MoonLoader } from 'react-spinners';

const AuthPage = lazy(() => import('@/components/AuthPage'));

export default function SignInPage() {
  return (
    <div className="app">
      <Header />
      <Suspense fallback={<MoonLoader style={{'margin': '0 auto'}}/>}>
        <AuthPage mode="signin" />
      </Suspense>
      <Footer />
    </div>
  )
}
