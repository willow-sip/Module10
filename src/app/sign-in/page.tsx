'use client';

import { lazy } from 'react';
import WithMoonLoader from '@/components/WithMoonLoader';

const AuthPage = lazy(() => import('@/components/AuthPage'));
const AuthPageWithLoader = WithMoonLoader(AuthPage);

export default function SignInPage() {
  return <AuthPageWithLoader mode="signin" />
}



