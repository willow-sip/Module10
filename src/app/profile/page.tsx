import { lazy, Suspense } from 'react';
import { MoonLoader } from 'react-spinners';

const Profile = lazy(() => import('@/components/Profile'));

export default function ProfilePage() {
    return (
        <Suspense fallback={<MoonLoader style={{ 'margin': '0 auto' }} />}>
            <Profile />
        </Suspense>
    )
}

