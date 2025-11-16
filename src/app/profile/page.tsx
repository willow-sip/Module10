'use client';

import { lazy } from 'react';
import withMoonLoader from '@/components/MoonLoaderHOC';

const Profile = lazy(() => import('@/components/Profile'));
const ProfileWithLoader = withMoonLoader(Profile);

export default function ProfilePage() {
    return <ProfileWithLoader />;
}

