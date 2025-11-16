'use client';

import { lazy } from 'react';
import withMoonLoader from '@/components/MoonLoaderHOC';

const AuthPage = lazy(() => import('@/components/AuthPage'));
const AuthPageWithLoader = withMoonLoader(AuthPage);

export default function SignInPage() {
  return <AuthPageWithLoader mode="signup" />
}
