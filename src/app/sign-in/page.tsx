'use client';
import AuthPage from '@/components/AuthPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SignInPage() {
  return (
    <div className="app">
      <Header />
      <AuthPage mode="signin" />
      <Footer />
    </div>
  )
}
