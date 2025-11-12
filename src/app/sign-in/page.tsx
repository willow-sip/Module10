import { lazy, Suspense } from 'react';
import { MoonLoader } from 'react-spinners';

const AuthPage = lazy(() => import('@/components/AuthPage'));

export default function SignInPage() {
  return (
    <Suspense fallback={<MoonLoader style={{ 'margin': '0 auto' }} />}>
      <AuthPage mode="signin" />
    </Suspense>
  )
}
